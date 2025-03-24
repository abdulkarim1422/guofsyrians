from models import user_model
from bson import ObjectId

async def create_user(user) -> user_model.User:
    await user.insert()
    return user

async def get_user_by_id(user_id: ObjectId) -> user_model.User:
    return await user_model.User.get(user_id)

async def update_user(user_id: ObjectId, user: user_model.User) -> user_model.User:
    existing = await user_model.User.get(user_id)
    if not existing:
        return None
    user.id = existing.id
    return await user.replace()

async def delete_user(user_id: ObjectId) -> user_model.User:
    user = await user_model.User.get(user_id)
    if user:
        await user.delete()
        return user
    return None

async def get_users() -> list:
    return await user_model.User.find({}).to_list()

async def get_user_by_email(email: str) -> user_model.User:
    return await user_model.User.find_one({"email": email})

async def get_user_by_username(username: str) -> user_model.User:
    return await user_model.User.find_one({"username": username})