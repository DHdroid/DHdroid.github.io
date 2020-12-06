---
layout: single
title:  "[python] Exception"
date:   2020-12-06
categories: python
---
### Exception Handling은 왜 해야하는가?
- 런타임에 발생하는 예기치 못한 동작을 관리함으로써, 데이터와 프로그램의 보호에 필수적입니다.

파이썬에는 Exception을 try-except문으로 관리합니다. try 블록에서 발생한 Exception을 받아 except에서 처리합니다.

예시)
``` python
a = [1,2]
try:
    print(a[3])
except IndexError:
    print("Exception occurred!")
```
<br />

### About Exception
- except 뒤에는 여러가지 Exception이 올 수 있으며, 여러 개의 except 문을 선언하는 것도 가능합니다.
- 어떤 BaseException를 상속받는 SuperException이 있다고 하면, SuperException의 발생은 except BaseException으로도 detect할 수 있습니다.
- 흔히 나오는 에러 메세지는 다음과 같은 꼴입니다.
  - `f"type(e).__name__: {e}"`
  - 예시: `IndexError: list index out of range`
- try-except-finally를 통해 Exception 발생과 handling 이후 동작을 정의할 수 있습니다.

<br />

### Custom Exception example
- Exception은 ~Error의 꼴로 정의하는 것이 일반적입니다.
  
``` python
class Error(Exception):
    '''
    Error의 Base Class
    '''
    pass

class MyError(Error):
    '''
    사용자가 정의한 Error 클래스
    '''
    def __init__(self, message):
        self.message = message

    def __str__(self):
        return self.message

raise MyError('My custom error occurred')
```