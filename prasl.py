import requests
import sys
import os
import time
import datetime
import urllib3
import pandas as pd
import time
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
# def access_ok(url:str):
#     httpsurl = 'https://' + url
#     headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36"}
#     try:
#         response = requests.get(httpsurl,headers=headers,verify=False,timeout=0.1)
#         return response.status_code
#     except Exception:
#         print("try http")
#         httpurl = 'http://' + url
#         try:
#             response = requests.get(httpurl,headers=headers,timeout=0.1)
#             return response.status_code
#         except Exception:
#             return "error"

def access_ok(url:str):
    create = {'http':0,'https':0,'httpreloc':0,'httpsreloc':0,'time':0,'times':0}
    # 记录时间戳
    create['time'] = time.time()
    httpsurl = 'https://' + url
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36"}
    try:
        response = requests.get(httpsurl,headers=headers,verify=False,timeout=5)
        create['https'] = response.status_code
        history = response.history
        # print("https",history)
        if len(history)!=0:
            hd = history[0].headers
            loc = hd.get("Location")
            if loc[:5]=='http':
                create['httpsreloc'] = 1
        # if len(history)!=0:
        #     create['httpsreloc'] = 1
    except Exception:
        print("no https")
    httpurl = 'http://' + url
    # 301永久重定向，302暂时重定向
    try:
        response = requests.get(httpurl,headers=headers,allow_redirects=True,timeout=5)
        create['http'] = response.status_code
        history = response.history
        if len(history)!=0:
            hd = history[0].headers
            loc = hd.get("Location")
            if loc[:5]=='https':
                create['httpreloc'] = 1
        # if len(history)!=0:
        #     create['httpreloc'] = 1
    except Exception:
        print("no http")
    return create

def test_domain(domain_name,times):
    date = datetime.datetime.now().strftime('%Y-%m-%d')
    # root = f'./{str(date)}/'
    root = f'./{str(times)}/'
    testsslpath = '/root/curl_testssl/testssl_function/testssl.sh/testssl.sh'
    school_name = domain_name.strip().split('.')[-3]
    result_dir = root + 'result/'+school_name
    c_result_dir =  root + 'result/' + school_name + '/curl_r'
    ts_result_dir = root + 'result/' + school_name + '/testssl_r'
    listd = [result_dir,c_result_dir,ts_result_dir]
    for dirs in listd:
        if not os.path.exists(dirs):
            os.makedirs(dirs)
    access = access_ok(domain_name)
    # print(access)
    access['times'] = times
    accessdata = pd.DataFrame([access])
    accessdata.to_csv(os.path.join(c_result_dir,domain_name+'.csv'),index=False)
    if access['https']!=0:
        # print(access_ok(domain_name))
        ts_result_file = root + 'result/' + school_name + '/testssl_r/' + domain_name + '.csv'
        if os.path.exists(ts_result_file):
            os.remove(ts_result_file)
        ts_command = testsslpath + ' -S -h -p -oC ' + ts_result_file + ' '  + domain_name
        # print(ts_command)
        os.system(ts_command)
    else:
        print('..............')

if __name__=="__main__":
    start_time = time.time()
    print(len(sys.argv))
    if len(sys.argv) == 3:
        domain_name = sys.argv[1]
        domain_name = domain_name.strip()
        times = sys.argv[2]
        test_domain(domain_name=domain_name,times = times)
        print('Use time:{:.2f}s'.format(time.time() - start_time))
    elif len(sys.argv) > 3:
        domains = sys.argv[1:-1]
        times = sys.argv[2]
        for domain_name in domains:
            domain_name = domain_name.strip()
            test_domain(domain_name=domain_name,times = times)
            print('Use time:{:.2f}s'.format(time.time() - start_time))
