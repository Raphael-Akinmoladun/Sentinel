from fastapi import FastAPI, UploadFile, File, HTTPException
import ai_vision, shutil, os


app = FastAPI()

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    """
    Stateless endpoint for Node.js API to call.
    Just returns the AI score.
    """
    if not os.path.exists("uploads"):
        os.makedirs("uploads")
        
    path = f"uploads/{file.filename}"
    with open(path, "wb") as buffer: 
        shutil.copyfileobj(file.file, buffer)

    try:
        score = ai_vision.compare_images("reference.jpg", path)
        return {"score": score}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Vision Error: {str(e)}")