from fastapi import FastAPI\nimport uvicorn\napp=FastAPI()\n@app.get('/health')\nasync def h(): return {'ok':True}\nif __name__=='__main__': uvicorn.run(app,host='127.0.0.1',port=9001)
