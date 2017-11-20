@echo --------------------------
@echo      Initializing...      
@echo --------------------------
start chrome "http://localhost:8000/"
subl index.html 
CALL python -m http.server 8000
@echo "Init Completed"