import requests
import subprocess
import time
import os


def send_get_request(url):
    try:
        response = requests.get(url)
        # Check if the request was successful
        if response.status_code == 200:
            print("GET request sent successfully to", url)
            return response.json()  # Assuming the response is in JSON format
        else:
            print("Failed to send GET request to", url, "- Status code:", response.status_code)
            return None
    except Exception as e:
        print("An error occurred while sending GET request to", url, ":", e)
        return None


def run_shell_script(script_path):
    try:
        process = subprocess.Popen(script_path)
        print("Shell script", script_path, "started successfully.")
        return process
    except Exception as e:
        print("Failed to start shell script", script_path, ":", e)


def read_file(directory):
    files = os.listdir(directory)
    if files:
        return files
    else:
        return None

if __name__ == "__main__":
    flag = False
    process = None
    url = "http://10.0.0.100:3002"  # Replace with your actual URL
    interval = 10  # in seconds
    directory = '/mnt/file/Music/playList/'


    while True:

        update = send_get_request(url+"/update")
        if(update and update.get("updateState") == True):
            folders = read_file(directory)
            lists = []
            for folder in folders:
                lists.append(read_file(directory+"/"+folder))
            requests.post(url+"/update", json={"folders":folders,"lists":lists})

        response = send_get_request(url+"/status")
        if flag:
            if process.poll() is not None:
                flag = False

        print("____________________")
        print(response,flag,update)

        if (response and response.get("playingState") == True) and (flag == False):  # Assuming the response is in JSON format
            get_playing = send_get_request(url+"/next")
            if get_playing is not None:
                playing = get_playing.get("playing")
                folder = get_playing.get("folder")
                print("playing:",playing)

                process = run_shell_script(["mpg123",
                        os.path.join(directory,
                                    folder,playing)])
                flag = True
            # requests.post(url2, json={"playing":random_file})

        elif (response and response.get("playingState") == False) and (flag == True):
            run_shell_script(["/bin/bash", 
                      "/mnt/file/Music/kill_music.sh"])
            flag = False
            
        time.sleep(interval)
