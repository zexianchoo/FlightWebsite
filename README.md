# Evaluation of Airline Tool (EAT2015)

Tool which references kaggle dataset https://www.kaggle.com/datasets/usdot/flight-delays. Data is hosted on SQL on Google Cloud Platform.
EAT2015 is a full-stack website which calls GCP API, with a pretty frontend.

To use:

0.
   - Download Google SDK - https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe (windows)
   - Authorize on google-cli https://cloud.google.com/sdk/docs/authorizing
2. navigate to base directory "./" and run `pip install -r requirements.txt` 
3. run server by running `python ./backend/app.py`
   1. Make sure that you already have credentials allowed on GCP
4. On another terminal (usually vscode), run npm run dev from "./frontend"

Find test output on http://localhost:5173/test

