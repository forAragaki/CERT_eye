#! /bin/bash

#set -x 

# 当前目录
curPath=$(readlink -f "$(dirname "$0")")
# 所有域名所在位置
filename='/get_fulldomain/output/domain/fulldomain_nd/'
suffix='.txt'
# "bit" "bjfu" "bjtu" "bjut" "bnu" "bsu" "buaa" "bucm"
# testdomain=("ahu" "bfsu","bit" "bjfu" "bjtu")
path="/root/curl_testssl/result_0501/"
files=$(ls $path)

time_count=1
while [ 1 ]
do
echo "the "$time_count" times"

for k in $files;do
# for k in ${testdomain[*]};do
    k=$k".edu.cn"
    echo $k
    c=0
    # 读
    exec <$curPath$filename$k$suffix
    while read line
    do
      account=$line
      accounts[$c]=$account
      ((c++))
    done

    domain_num=$c
    Nproc=5

    trap "exec 777>&-;exec 777<&-;exit 0" 2

    mkfifo ./fifo.$$ && exec 777<> ./fifo.$$ && rm -f ./fifo.$$

    for ((i=0;i<Nproc;i++)); do
      echo >&777
    done

    today=$(date +%m%d)

    # rm -rf ./result/*
    # rm -rf ./log/$1
    mkdir -p ./$today.log/$k/details
    for ((i=0;i<$domain_num;i++)) do
    {
      read -u777
      echo "[*] processing $k ${accounts[$i]}"
      {
        start_time=$SECONDS
        python3 prasl.py ${accounts[$i]} ${time_count} >> ./$today.log/$k/details/${accounts[$i]}.log 2>&1
        sleep 10
        end_time=$SECONDS
        echo "${accounts[$i]} : $[$end_time-$start_time]" >> ./$today.log/$k/time.log 2>&1
      } || {
        echo "[-] failed $k ${accounts[$i]}" >> ./$today.log/$k/failed.log 2>&1
        continue
      }
      echo "[+] finish $k ${accounts[$i]}" >> ./$today.log/$k/finished.log 2>&1
      echo >&777
    }&
    done
    wait
    # 处理完一个学校后,存入数据库
    python3 anasiss.py ${time_count} ${k} >> ./$today.log/$k/sql.log 2>&1
    # python3 show_result.py $1
    echo $domain_num
done
echo -e "time-consuming:$SECONDS seconds" >> ./$today.log/$k/time.log 2>&1
((time_count++))
done
