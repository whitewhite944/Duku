from cryptography.fernet import Fernet

class prpcrypt:
    key = 'cezaR18FORQfskvdiYwJ7JoaQykv28BV7mTIxqTiG4Q='

    @classmethod
    def encrypt(cls, password):
        cipher = Fernet(cls.key)
        password_encode = password.encode()
        token = cipher.encrypt(password_encode)
        return token.decode()
        
    @classmethod
    def decrypt(cls, password):
        cipher = Fernet(cls.key)
        password_encode = password.encode()
        token = cipher.decrypt(password_encode)
        return token.decode()             