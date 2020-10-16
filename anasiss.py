import pandas as pd
import os
import time,datetime
import pymysql
from sqlalchemy import create_engine
import sys
# store results
cert_cal = ["Let's Encrypt","TrustAsia","GeoTrust","DigiCert",
"Encryption Everywhere","GlobalSign","RapidSSL",
"GoGetSSL","WoTrus","Sectigo Secure Site","WoSign",
"COMODO","Go Daddy","AlphaSSL","Symantec","Thawte","CFCA","GDCA"]
DNA_CAA = 0
HSTS = 0
certvalid = 0
cert_sig_algo = 0
cert_notAfter = 0
cert_trust = 0
chain_notrust = 0
# curl_r / testssl_r
cert_number = 0

temp = ["DNS_CAArecord","HSTS","cert_caIssuers","cert_signatureAlgorithm","cert_notAfter","cert_trust",
"cert_chain_of_trust","cert_serialNumber",
"HSTS_time","HSTS_subdomains","HSTS_preload"]
certmap = {}
for tp in temp:
    certmap[tp] = [tp] + [tp+f" <cert#{x}>" for x in range(1,5)]
    
def onefile(sc_name:str,root:str):
    sc_path = os.path.join(root,sc_name)
    sc_path_curl = os.path.join(sc_path,'curl_r')
    sc_path_testssl = os.path.join(sc_path,'testssl_r')
    finalcurl = pd.DataFrame()
    for i,curl in enumerate(os.listdir(sc_path_curl)):
        dt = pd.read_csv(os.path.join(sc_path_curl,curl))
        finalcurl.loc[i,'domain_name'] = curl
        finalcurl.loc[i,'http'] = dt['http'].iloc[0]
        finalcurl.loc[i,'https'] = dt['https'].iloc[0]
        finalcurl.loc[i,'httpreloc'] = dt['httpreloc'].iloc[0]
        finalcurl.loc[i,'httpsreloc'] = dt['httpsreloc'].iloc[0]
        finalcurl.loc[i,'time'] = dt['time'].iloc[0]
        finalcurl.loc[i,'times'] = dt['times'].iloc[0]
    finalssl = pd.DataFrame()
    for i,ssl in enumerate(os.listdir(sc_path_testssl)):
        # repeated TCP connect problems, giving up
        # 解决testssl没有测出的问题(有时可连接https，但是测试无法进行)
        try:
            print(ssl)
            data = pd.read_csv(os.path.join(sc_path_testssl,ssl))
            finalssl.loc[i,'domain_name'] = ssl
            tls1_3 = data[data.id=='TLS1_3'].finding.values[0]
            tls1 = data[data.id=='TLS1'].finding.values[0]
            tls1_1 = data[data.id=='TLS1_1'].finding.values[0]
            tls1_2 = data[data.id=='TLS1_2'].finding.values[0]
            ssl2 = data[data.id=='SSLv2'].finding.values[0]
            ssl3 = data[data.id=='SSLv3'].finding.values[0]
            finalssl.loc[i,'TLS1'] = 1
            finalssl.loc[i,'TLS1_1'] = 1
            finalssl.loc[i,'TLS1_2'] = 1
            finalssl.loc[i,'TLS1_3'] = 1
            finalssl.loc[i,'SSLv2'] = 1
            finalssl.loc[i,'SSLv3'] = 1
            if "not offered" in tls1:
                finalssl.loc[i,'TLS1'] = 0
            if "not offered" in tls1_1:
                finalssl.loc[i,'TLS1_1'] = 0
            if "not offered" in tls1_2:
                finalssl.loc[i,'TLS1_2'] = 0
            if "not offered" in tls1_3:
                finalssl.loc[i,'TLS1_3'] = 0
            if "not offered" in ssl2:
                finalssl.loc[i,'SSLv2'] = 0
            if "not offered" in ssl3:
                finalssl.loc[i,'SSLv3'] = 0
            if data[data.id.isin(certmap['DNS_CAArecord'])].finding.values[0]!='--':
                finalssl.loc[i,'DNS_CAA'] = 1
            else:
                finalssl.loc[i,'DNS_CAA'] = 0
            # 初始化
            finalssl.loc[i,'HSTS_time'] = ""
            finalssl.loc[i,'HSTS_subdomains'] = ""
            finalssl.loc[i,'HSTS_preload'] = ""
            if data[data.id.isin(certmap['HSTS'])].shape[0]==0:
                finalssl.loc[i,'HSTS'] = 1
                finalssl.loc[i,'HSTS_time'] = data[data.id.isin(certmap['HSTS_time'])].finding.values[0]
                finalssl.loc[i,'HSTS_subdomains'] = data[data.id.isin(certmap['HSTS_subdomains'])].finding.values[0]
                finalssl.loc[i,'HSTS_preload'] = data[data.id.isin(certmap['HSTS_preload'])].finding.values[0]
            else:
                finalssl.loc[i,'HSTS'] = 0
            cacert = data[data.id.isin(certmap['cert_caIssuers'])].finding.values[0]
            finalssl.loc[i,'CA'] = 'Other'
            finalssl.loc[i,'certvalid'] = 0
            for ct in cert_cal:
                if ct in cacert:
                    finalssl.loc[i,'certvalid'] = 1
                    finalssl.loc[i,'CA'] = ct
                    break
            signature = data[data.id.isin(certmap['cert_signatureAlgorithm'])].finding.values[0]
            finalssl.loc[i,'cert_algo_type'] = signature
            finalssl.loc[i,'cert_sig_algo'] = 0
            if "SHA1" in signature or "MD5" in signature:
                finalssl.loc[i,'cert_sig_algo'] = 1
            noafter = data[data.id.isin(certmap['cert_notAfter'])].finding.values[0]
            timeArray = time.strptime(noafter, "%Y-%m-%d %H:%M")
            timeStamp = int(time.mktime(timeArray))
            now = int(time.time())
            finalssl.loc[i,'cert_notAfter'] = 1
            if now>=timeStamp:
                finalssl.loc[i,'cert_notAfter'] = 0
            
            trust = data[data.id.isin(certmap['cert_trust'])].finding.values[0]
            finalssl.loc[i,'cert_trust'] = 0
            if trust.split(" ")[0]=="Ok":
                finalssl.loc[i,'cert_trust'] = 1
            
            finalssl.loc[i,'chain_notrust'] = 1
            chain = data[data.id.isin(certmap['cert_chain_of_trust'])].finding.values[0]
            if chain!='passed.':
                finalssl.loc[i,'chain_notrust'] = 0
            ct_number = data[data.id.isin(certmap['cert_serialNumber'])].finding.values[0]
            finalssl.loc[i,'cert_number'] = ct_number

        except Exception as e:
            print(e)
    return finalcurl,finalssl
# onefile('result/bsu/testssl_r/2fjy.bsu.edu.cn.csv')
def function(a,b,c,d):
    # http, https, httpreloc, httpsreloc
    if a!=0 and b!=0:
        if c!=0 and d!=0:
            return 1.1
        elif c!=0:
            return 1.2
        elif d!=0:
            return 1.3
        return 1.0
    elif a!=0 and b==0:
        return 2.0
    elif a==0 and b!=0:
        return 3.0
    elif a==0 and b==0:
        return 0.0
    return -1.0


if  __name__ == "__main__":
    args = sys.argv[1]
    scname = sys.argv[2]
    root = f'/root/curl_testssl/{args}/result'
    # school_name = os.listdir(root)
    # for nm in school_name:
    scname = scname.split(".")[0]
    print(scname)
    a,b = onefile(scname,root)
    if b.columns.shape[0]==0:
        exit()
    if 'cert_sig_algo' not in b.columns.values:
        exit()
    a['https_result'] = a.apply(lambda x:function(x.http,x.https,x.httpreloc,x.httpsreloc),axis=1)
    # 为1即不合法
    b['isnovalid'] = (b['cert_sig_algo']==1)|(b['certvalid']==0)|(b['cert_notAfter']==0)|(b['cert_trust']==0)|(b['chain_notrust']==0)
    b['used_cert_novalid'] = b.groupby('cert_number')['isnovalid'].transform('sum')==0
    # 0则为不合法
    final = pd.merge(a[['domain_name','https_result','time','times']],b,on=['domain_name'],how='left')

    conn = create_engine('mysql+pymysql://admin:CERT_eye2020@localhost:3306/allfinalbase',encoding='utf8')  
    #写入数据，table_name为表名，‘replace’表示如果同名表存在就替换掉
    pd.io.sql.to_sql(final, scname, conn, if_exists='append')
