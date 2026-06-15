#!/bin/bash
cd "$(dirname "$0")"
PORT=8723
echo "SCHWITZWERK — http://localhost:$PORT"
open "http://localhost:$PORT"
python3 -m http.server $PORT
