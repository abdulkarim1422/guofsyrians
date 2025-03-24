from models import member_model, team_model, user_model
from crud import member_crud, team_crud, user_crud

async def signup_user(username: str, email: str, password: str, member_id: str) -> user_model.User:
    user = user_model.User(username=username, email=email, password=password, member_id=member_id)
    return await user_crud.create_user(user)