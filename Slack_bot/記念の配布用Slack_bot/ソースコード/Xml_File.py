import xml.etree.ElementTree as ET
from xml.etree import ElementTree


class Create_Xml_File(object):
    def __init__(self):
        #インスタンス変数
        self.File_name = []

    # selfはこの関数を呼び出したオブジェクト自身を表す。そして、第一引数に指定しなければエラーになる。
    def edit_xml_file(self, days):
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

            # xmlファイルの読み込み
            file_name = 'C:/Slack_bot/記念の配布用Slack_bot/slack_bot0' + str(index + 1) + '.xml'

            # rootから辿る。xmlファイルにネームスペースがあったので、めんどくさい書き方になった。
            tree = ET.parse(file_name)
            ElementTree.register_namespace('', 'http://schemas.microsoft.com/windows/2004/02/mit/task')
            for node in tree.findall(".//{http://schemas.microsoft.com/windows/2004/02/mit/task}DaysOfWeek"):
                #  node直下の階層の要素、テキスト全てを削除する。（要素だけ削除したかったけど出来なかったため。）
                node.clear()

            for node in tree.findall(".//{http://schemas.microsoft.com/windows/2004/02/mit/task}DaysOfWeek"):
                #  node直下の階層に要素を追加する。
                ET.SubElement(node, after_days)

            #  編集したxmlファイルの名前を配列に格納しておいて、後から使えるようにする。
            self.File_name.append("slack_bot" + str(index + 1) +"_"+ after_days+".xml")

            print(self.File_name[index])

            # タスクスケジューラのエンコーディングはデフォルトのこのままじゃないとだめ。引数を増やすしてはだめ。
            tree.write('C:/Slack_bot/記念の配布用Slack_bot/'+self.File_name[index])
