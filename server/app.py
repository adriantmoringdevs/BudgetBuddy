from flask import request, session, jsonify
from flask_restful import Resource
from config import app, db, api
from models import User, UserSchema, Category, CategorySchema, Expense, ExpenseSchema
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func
from flask_cors import CORS

CORS(app, supports_credentials=True, origins=["http://localhost:5000"]) 

class Users(Resource):
    def post(self):
       request_json = request.get_json()
       user = User(
           username=request_json["username"]
       )
       try:
           db.session.add(user)
           db.session.commit()
           return UserSchema().dump(user), 201
       except IntegrityError:
           return {'error': '422 Unprocessable Entity'}, 422
       
class Login(Resource):
    def post(self):
        username = request.get_json()['username']

        user = User.query.filter(User.username == username).first()
        if user:
            session['user_id'] = user.id
            session['username'] = user.username
            return UserSchema().dump(user), 200
        
        return {'error': 'User not Found'}, 404 
    
class Logout(Resource):
    def delete(self):
        if session.get('user_id'):
            session['user_id'] = None
            return {}, 204
        return {'error': 'No user_id in session.'}
         
class UpdateIncome(Resource):
    def put(self):
        user_id = session.get('user_id')
        if user_id:
            user = User.query.get(user_id)
            user.income = request.get_json()['income']
            db.session.commit()
            return UserSchema().dump(user), 201
        
        return {"error": "No active session"}, 401
    
class Expenses(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            filters = request.get_json(silent=True) or {}
            subcategory = filters.get('subcategory')
            is_fixed = filters.get('is_fixed')

            query = Expense.query.filter(Expense.user_id == user_id)
            
            if subcategory:
                query = query.join(Category).filter(Category.subcategory == subcategory)

            if is_fixed is not None:
                print(is_fixed)
                query = query.filter(Expense.is_fixed == is_fixed)

            results = query.all()
            return ExpenseSchema(many=True).dump(results), 200
        return {'error': '401 Unauthorized'}, 401 
    
    def post(self):
        user_id = session.get('user_id')
        if user_id:
            request_json = request.get_json()
            category = Category.query.filter(Category.category==request_json["category"]).first()
            print(category)
            expense = Expense(
                user_id = user_id,
                category_id = category.id,
                name = request_json["name"],
                amount = request_json.get("amount", 0),
                is_fixed = request_json["is_fixed"]
            )
            db.session.add(expense)
            db.session.commit()

            return ExpenseSchema().dump(expense), 201

        return {"error": "Unauthorized"}, 401
    
    def put(self):
        user_id = session.get('user_id')
        if user_id:
            request_json = request.get_json()
            category = Category.query.filter(Category.category==request_json["category"]["category"]).first()
            expense = Expense.query.filter(Expense.id == request_json["id"]).first()
            expense.name = request_json["name"]
            expense.category_id = category.id
            expense.amount = request_json["amount"]
            expense.is_fixed = request_json["is_fixed"]
            db.session.commit()

            return ExpenseSchema().dump(expense), 200

        return {'error': '401 Unauthorized'}, 401
    
    def delete(self):
        user_id = session.get('user_id')
        if user_id:
            request_json = request.get_json()
            Expense.query.filter(Expense.id == request_json["id"]).delete()
            db.session.commit()

            return {"status": "deleted"}, 200

        return {'error': '401 Unauthorized'}, 401
    
class BudgetPercentage(Resource):
            def get(self):
                user_id = session.get('user_id')
                if user_id:
                    result = Expense.query.join(Expense.category).with_entities(Category.subcategory, func.sum(Expense.amount).label("total"))\
                    .group_by(Category.subcategory).filter(Expense.user_id == user_id).all()

                    result_map = {}
                    
                    for percent in result:
                        result_map[percent[0]] = f"{percent[1]}"
                    
                    return result_map, 200
 

api.add_resource(Users, '/api/users', endpoint='users')
api.add_resource(Login, '/api/login', endpoint='login')
api.add_resource(Logout, '/api/logout', endpoint='logout')
api.add_resource(UpdateIncome, '/api/users/income')
api.add_resource(Expenses, '/api/expenses', endpoint='expenses')
api.add_resource(BudgetPercentage, '/api/budget/totals')

if __name__ == '__main__':
    app.run(debug=True)