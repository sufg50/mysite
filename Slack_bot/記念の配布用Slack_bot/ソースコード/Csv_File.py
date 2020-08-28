import csv
import Xml_File
import os
import datetime


class Create_csv_file(object):

    def on_what_day2(self, days):
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

    def what_zigen(self):
        now = datetime.datetime.now()
        now_hour = now.strftime('%H')
        now_mini = now.strftime('%M')
        now_hour = int(now_hour)
        now_mini = int(now_mini)
        w = 0
        if 9 == now_hour and 25 <= now_mini <= 35:
            w = '1'
        elif 11 == now_hour and 5 <= now_mini <= 15:
            w = '2'
        elif 13 == now_hour and 25 <= now_mini <= 35:
            w = '3'
        elif 15 == now_hour and 5 <= now_mini <= 15:
            w = '4'

        return w

    def create_attend_message(self):
        now = datetime.datetime.now()
        now_date = now.strftime('20%y-%m-%d')
        name = ''
        student_num = ''
        with open('slack_touroku.csv', 'r', newline='')as csv.file:
            reader = csv.DictReader(csv.file)
            for row in reader:
                name = row['名前']
                student_num = row['学生番号']
        zigen = self.what_zigen()
        zigen = str(zigen)
        attend_message = '[' + now_date + ']' + '[' + zigen + ']' + name + '[' + student_num + ']'
        return attend_message

    def get_email(self):
        email = ''
        with open('slack_touroku.csv', 'r', newline='')as csv.file:
            reader = csv.DictReader(csv.file)
            for row in reader:
                email = row['slackメールアドレス']

        return email

    def get_work_space_url(self):
        now = datetime.datetime.now()
        now_youbi = now.strftime('%A')
        print("曜日:"+now_youbi)
        work_space_url = ''
        with open('slack_touroku.csv', 'r', newline='')as csv.file:
            reader = csv.DictReader(csv.file)
            for row in reader:
                if now_youbi == row['曜日']:
                    work_space_url = row['ワークスペース名']
        return work_space_url

    def get_channel_url(self):
        now = datetime.datetime.now()
        now_youbi = now.strftime('%A')
        channel_url = ''
        with open('slack_touroku.csv', 'r', newline='')as csv.file:
            reader = csv.DictReader(csv.file)
            for row in reader:
                if now_youbi == row['曜日']:
                    channel_url = row['チャンネル名']
        return channel_url


    def add_csv_row(self):
        print('追加するワークスペース名を入力してください。')
        work_space_name = input()
        print('出欠のメッセージを送るチャンネルのurlを入力してください。')
        channel_url = input()
        print('何曜日にメッセージを送りますか？例）月曜日なら1,火曜日なら2と入力してください')
        when_days = input()

        # 　Xml_Fileクラスの関数を使う。
        xml_ins = Xml_File.Create_Xml_File()
        xml_ins.edit_xml_file(when_days)

        print('何時限目の時間にメッセージを送りますか？例）1,2と入力してください。')
        when = input()
        when = when.split(',')
        print("タスクスケジューラにプログラム開始時刻を登録します。")

        for i in when:
            file_name = xml_ins.File_name[int(i) - 1]
            attend_cmd_message = "schtasks /Create /XML C:\Slack_bot\記念の配布用Slack_bot\\" + str(file_name) + " /TN " + str(
                file_name)
            os.system(attend_cmd_message)

        #  変更なしのメールアドレスなどはcsvファイルから取得して使いまわす。
        e_mail = ""
        student_name = ''
        student_num = ''
        youbi = ""
        youbi = self.on_what_day2(when_days)

        with open('slack_touroku.csv', 'r', newline='')as csv.file:
            reader = csv.DictReader(csv.file)
            for row in reader:
                e_mail = row['slackメールアドレス']
                student_name = row['名前']
                student_num = row['学生番号']

        # csvファイルに追記するときはリスト形式あることに注意
        result = [e_mail, student_name, student_num,
                  work_space_name, channel_url, youbi
                  ]

        # csvファイルに行を追加登録する。
        with open('slack_touroku.csv', 'a', newline='') as csv.file:
            writer = csv.writer(csv.file)
            # row　は行という意味。
            writer.writerow(result)

        print('他の講義の出欠を登録しますか？追加する場合はyを押してください。')
        answer_add = input()
        if answer_add == 'y':
            self.add_csv_row()
