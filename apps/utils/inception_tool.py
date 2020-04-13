import MySQLdb

def inception_status(dbconn, dbname, sqlcontent):
    sql = '''/*%s*/\
      inception_magic_start;\
      use %s; %s inception_magic_commit;''' % (dbconn, dbname, sqlcontent)
    try:
        conn = MySQLdb.connect(host='127.0.0.1', user='root', passwd='', port=4000, db='', use_unicode=True, charset="utf8")
        cur = conn.cursor()
        cur.execute(sql)
        result = cur.fetchall()
        cur.close()
        conn.close()
        status = 0
    except MySQLdb.Error as e:
        result = ["MySQL Error %d: %s" % (e.args[0], e.args[1])]
        status = -1
    return status, result

def rollback_data(sql, db_name=''):
    conn = MySQLdb.connect(host='127.0.0.1', user='root', passwd='123456', port=3306, db=db_name, use_unicode=True, charset="utf8")
    conn.autocommit(True)
    cur = conn.cursor()
    cur.execute(sql)
    result = cur.fetchall()
    cur.close()
    conn.close()
    return result
