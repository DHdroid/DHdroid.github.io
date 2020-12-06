---
layout: single
title:  "[python] 부모 클래스 생성자"
date:   2020-11-23
categories: python
---
pytorch 모델을 개발하다 보면, 다음과 같은 부모 클래스 생성자 호출 코드를 확인할 수 있다.

``` python
super(Seq2Seq, self).__init__()
```
하지만 실제로는 다음과 같이 클래스명을 생략해도 문제 없이 작동한다.
```python
super().__init__()
```
<br/>
이는 python 업데이트에 의한 것으로 python 2.x 에서는 다음과 같이 두 가지 문법들만 가능했다.

``` python
super(ClassName, self).__init__()
super(ClassName, self).__init__(**kwargs)
```

하지만, python 3.x 로 넘어오면서
```python
super().__init__()
super().__init__(**kwargs)
```
역시 가능해졌고, 범용성을 위해서 전자의 방법으로 많이 사용한다고 한다.
<br/><br/>
여담으로 `super()` 대신, 부모 클래스의 클래스명을 직접 사용하는 것도 가능하다.