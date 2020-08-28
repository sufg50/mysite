from selenium import webdriver
import datetime
import getpass
from time import sleep
from selenium.webdriver.common.keys import Keys
import csv
import os
import Xml_File
import Csv_File


def on_what_day(days):
    after_days = ""
    for index in range(4):
        if days == '1':
            after_days = "Monday"
        if days == '2':
            after_days = "Tuesday"
        if days == '3':
            after_days = "Wednesday"
        if days == '4':
            after_days = "Thursday"
        if days == '5':
            after_days = "Friday"
    return after_days



def Sign_UP_syokai_touroku():
    print('初期登録をします')
    # デフォルトワークスペース、チャンネルurl
    work_space_name = 'project-kcg-2020-mlt'
    channel_url = 'https://app.slack.com/client/T012SSEB916/C012FQP89MX'
    when_days = '4'

    print('現在のワークスペース名はproject-kcg-2020-mlt、チャンネルurlは出席カウンタ-プロ演2のurlです。\n変更する場合はyを押してください。')
    answer = input()
    if answer == 'y':
        print('新しいワークスペース名を入力してください。')
        work_space_name = input()
        print('出欠のメッセージを送るチャンネルのurlを入力してください。')
        channel_url = input()
        print('何曜日にメッセージを送りますか？例）月曜日なら1,火曜日なら2と入力してください')
        when_days = input()

        xml_ins = Xml_File.Create_Xml_File()
        xml_ins.edit_xml_file(when_days)

        print('何時限目の時間にメッセージを送りますか？例）1,2と入力してください。')
        when = input()
        when = when.split(',')
        print("タスクスケジューラにプログラム開始時刻を登録します。")
        for i in when:
            file_name = xml_ins.File_name[int(i)-1]
            attend_cmd_message = "schtasks /Create /XML C:\Slack_bot\記念の配布用Slack_bot\\"+str(file_name)+" /TN "+str(file_name)
            os.system(attend_cmd_message)
    else:
        print("タスクスケジューラにプログラム開始時刻を登録します。")
        os.system("schtasks /Create /XML C:\Slack_bot\記念の配布用Slack_bot\slack_bot01_04.xml /TN slack_bot01_04")




    print('Slackサインイン用のメールアドレスを入力してください。')
    e_mail = input()
    print('名前を入力してください。')
    student_name = input()
    print('学生番号を入力してください。')
    student_num = input()
    youbi = on_what_day(when_days)
    result = {
        'slackメールアドレス': e_mail,
        '名前': student_name,
        '学生番号': student_num,
        'ワークスペース名': work_space_name,
        'チャンネル名': channel_url,
        '曜日': youbi
    }
    with open('slack_touroku.csv', 'w', newline='') as csv.file:
        field_names = ['slackメールアドレス', '名前',
                       '学生番号', 'ワークスペース名', 'チャンネル名', '曜日']
        writer = csv.DictWriter(csv.file, fieldnames=field_names)
        writer.writeheader()
        writer.writerow(result)

    print('他の講義の出欠を登録しますか？追加する場合はyを押してください。')
    answer_add = input()

    cs_ins = Csv_File.Create_csv_file()

    if answer_add == 'y':
        cs_ins.add_csv_row()

    print('初期登録を終了しました。画面を閉じます')
    sleep(3)
    exit()



if os.path.exists('slack_touroku.csv') != True:
    Sign_UP_syokai_touroku()



#  ------- 初期登録済みだったらここからプログラムが始まる。-----

print('slackサインイン用のパスワードを入力して下さい。（見えないです）')
password = getpass.getpass('password: ')

# csvファイル操作をするインスタンスを作成。ファイル名.クラス名()でインスタンスができる
cs_ins = Csv_File.Create_csv_file()

attend_message = cs_ins.create_attend_message()
print(attend_message)
work_space_url = cs_ins.get_work_space_url()
channel_url = cs_ins.get_channel_url()
print('ワークスペース名:' + work_space_url)
print('チャンネル名:' + channel_url)
sleep(2)

# ブラウザを指定されたURLで開く。
# browser = webdriver.Chrome()
# browser.get('https://slack.com/signin#/')

# choromeだと勝手にブラウザがアップデートされてドライバーを変更する必要が何度もあるのでfirefoxにする
browser = webdriver.Firefox()
browser.get('https://slack.com/signin?from_get_started=1')

# step1、ワークスペースのurlを入力する。
slack_ele = browser.find_element_by_class_name('no_bottom_margin')
slack_url = slack_ele.find_element_by_id('domain')
slack_button = browser.find_element_by_class_name('large_bottom_margin')
slack_button = slack_button.find_element_by_id('submit_team_domain')
slack_url.send_keys(work_space_url)
slack_button.click()

# ページ遷移後のurlが切り替わるまで待つ
print('現在のＵＲＬを表示', browser.current_url)
sleep(2)

# step2,メールアドレス、パスワードを入力してログインする
slack_email = browser.find_element_by_id('email')
slack_password = browser.find_element_by_id('password')
slack_ele_login_button = browser.find_element_by_id('signin_btn')

slack_email.send_keys(cs_ins.get_email())
slack_password.send_keys(password)
slack_ele_login_button.click()
sleep(2)
# 同じワークスペース内でurlを切り替えてページ遷移する。
browser.get(channel_url)
sleep(2)

# step3,出欠のメッセージを送る。
slack_attend_message = browser.find_element_by_id('undefined')
print(attend_message)
slack_attend_message.send_keys(attend_message)
sleep(1)
slack_button = browser.find_element_by_class_name('ql-buttons')
slack_button = slack_button.find_elements_by_class_name('c-button-unstyled')
slack_attend_message.send_keys(Keys.CONTROL, Keys.RETURN)
# slack_button[0].click()
