from app.models import member_model, team_model, user_model
from app.crud import member_crud, team_crud, user_crud
from passlib.hash import bcrypt

async def signup_user(username: str, email: str, password: str, member_id: str) -> user_model.User:
    hashed_password = bcrypt.hash(password)
    user = user_model.User(username=username, email=email, password=hashed_password, member_id=member_id)
    return await user_crud.create_user(user)

async def signin_user(email_or_username: str, password: str) -> user_model.User:
    if "@" in email_or_username:
        user = await user_crud.get_user_by_email(email_or_username)
    else:
        user = await user_crud.get_user_by_username(email_or_username)
    if user:
        if bcrypt.verify(password, user.password):
            return user
        else:
            return "Incorrect password"
    return "User not found"