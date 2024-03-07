## Steps for Installation of Bot

### For Linux System 

0. **Update and Upgrade Advanced Package Tool**
```
sudo apt-get update -y && sudo apt-get upgrade -y
```

1. **Install Python**
```
sudo apt install python3
```

2. **Install Python Packege Manager**
```
sudo apt install python3-pip
```

3. **Install Python Virtual Environemt**
```
sudo apt-get install python3-venv
```

4. **Create Python Virtual Environment****
```
python3 -m venv ./Virtual_Environment_Name
```

5. **Activate Python Virtual Environemt**
```
source Virtual_Environment_Name/bin/activate
```

6. **Install Dependencies Using Pip**
```
pip install -r requirements.txt
```

7. **Install  English Medium-Sized SpaCy Model**
```
python -m spacy download en_core_web_md
```

#### **NOTE: 
- Create the Python Virtual Environment  in the directory where all requirements of project will be installed and bot will run.


## Chages to be Made

1. **In `app.py`**
- Chage the Host and Port for RASA API URL and for Flask App.

2. **In `config.yml`**
- Change action_endpoint url port number if rquired. This the port where Rasa Action is Runing. 

3. **In `static/js/components/pdfAttachment.js`**
- Chage the Host and Port for the PDF File of Holiday List. Keep same as of Flask App. Or as per your convinience. 


## Commands to Run Rasa Core Rasa Action and Flask App Server**

1. **Rasa Core Server**
```
rasa run --port port_number
```

2. **Rasa Actuiosn Server**
```
rasa run actions --port port_number
```

3. **Flask App Server**
```
python3 app.py
```

#### **NOTE: 
- All the above three commands must be runed in Active Python Virtual Environment. To Activate Python Virtual Environment Run
```
source Virtual_Environment_Name/bin/activate
```