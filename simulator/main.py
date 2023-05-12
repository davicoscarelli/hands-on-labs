import os
from flask import Flask, render_template, redirect, request, send_file, g, session 
from flask_login import LoginManager, UserMixin, current_user, login_user, login_required, logout_user 
from flask_sqlalchemy import SQLAlchemy 
from werkzeug.security import generate_password_hash, check_password_hash

files_path = os.path.dirname(os.path.abspath(__file__)) 

database_main_file = "sqlite:///{}".format(os.path.join(files_path, "primary.db")) 

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = database_main_file
app.secret_key = "vwebvji2biubweuvb92bv82b3voibw"

login = LoginManager()
login.init_app(app)
login.login_view = 'login'

db = SQLAlchemy(app)

class User(UserMixin, db.Model): 
    __tablename__ = 'User'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(200))
    password = db.Column(db.String(200))
    email = db.Column(db.String(100))
    courses = db.Column(db.String(255))
    def __repr__(self):
        return "<Username: {}>".format(self.username)
    
@login.user_loader
def load_user(id):
    return User.query.get(int(id))

@app.route('/')
def hello():
    return redirect("/login")

@app.route('/register', methods=['GET','POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']
        courses = "[]"
        user = User.query.filter_by(email=email).first()
        if user is not None:
            error = 'This email is already registered! please choose a new email or Login.'
            return render_template('/signup/index.html', error_register=error)
        if len(password) < 8:
            error = 'Your password should be at least 8 symbols long. Please, try again.'
            return render_template('/signup/index.html', error_register=error)
        
        new_user = User(username=username, password=generate_password_hash(password, method='sha256'), email = email, courses = courses)
        db.session.add(new_user)
        db.session.commit()
        return render_template('/login/index.html')
    elif request.method == 'GET':
        return render_template('/signup/index.html')
    

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()  
        
        if not user or not check_password_hash(user.password, password):
            error = 'The password or the username you entered is not correct!'
            return render_template('/login/index.html', message=error)
        login_user(user)
        return redirect('/dashboard')
        
    elif request.method == 'GET':
        return render_template('/login/index.html')


@app.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    logout_user()
    return redirect('/login')


@app.route('/dashboard', methods=["GET", "POST"])
@login_required
def waitroom():
    g.user = current_user
    return render_template("/dashboard/index.html", myuser=current_user)


@app.route('/simulator', methods=["GET", "POST"])
@login_required
def simulator():
    g.user = current_user
    return render_template("/simulator/index.html", myuser=current_user)



if __name__ == "__main__":
    app.run(debug = True)
    TEMPLATES_AUTO_RELOAD = True