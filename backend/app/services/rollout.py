import hashlib

def get_bucket(user_id: str, flag_key: str):
    value = f"{user_id}:{flag_key}"

    hash_value = hashlib.md5(value.encode()).hexdigest()

    bucket = int(hash_value, 16) % 100

    return bucket