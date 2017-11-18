@echo OFF
CALL C:\Users\2018qciccore\venv\Scripts\activate
start chrome "http://localhost:8000/jenga.html"
"C:\Program Files (x86)\Sublime Text 3\subl.exe" index.html 
CALL python -m http.server 8000
@echo "Init Completed"