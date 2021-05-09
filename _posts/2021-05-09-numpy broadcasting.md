---
layout: single
title:  "[python] numpy broadcasting"
date:   2021-01-17
categories: CV
toc: true
---
## 소개
numpy를 이용한 코드를 작성하다보면, 두 operand간 shape이나 dimension이 안맞는 경우가 종종 발생하는데요, 이때 일어나는 암시적안 연산을 broadcasting이라고 부릅니다.

## numpy?
numpy는 각종 수학적인 연산을 지원하는 python 라이브러리로, operation들이 내부적으로 C로 구현되어 있어 python-native operation들보다 우수한 성능의 행렬 및 벡터 연산을 지원합니다.  
또한 편리성면에서도 압도적인데, 이게 돼? 싶은 연산들이 numpy에서는 되는 경우가 많습니다. 그만큼 라이브러리 내부에서 암시적으로 처리해주는 부분들이 많다는 것인데, 그 중 하나가 오늘 다룰 **broadcasting**입니다.

## broadcasting
<br/>  

numpy는 다음과 같이 element-wise한 연산을 기본으로 동작합니다.  
``` python
a = np.array([1.0, 2.0, 3.0])
b = np.array([4.0, 5.0, 6.0])
print(a+b) # array([5.0, 7.0, 9.0])
```
<br/>  

그렇다면 다음과 같이 두 array의 shape이 다르다면 어떤 일이 벌어질까요?
``` python
a = np.array([[1.0, 2.0],[3.0, 4.0]]) # shape=(2,2)
b = np.array([4.0, 5.0]) # shape=(2)
```
<br/>  

놀랍게도 아무 이상 없이 연산이 이루어집니다.
```python
print(a+b) # array([[5.0, 7.0], [7.0, 9.0]])
```
<br/>  

**두 array의 shape이 다른데 어떻게 연산이 가능했을까요?**  numpy에서는 특정 조건 하에 서로 다른 shape의 두 array의 연산을 지원하기 때문입니다. 이것을 **broadcasting**이라고 하는데, 그 조건은 다음과 같습니다.
두 array의 shape을 가장 마지막 차원으로부터 차례대로 비교했을 때, 그 차원의 shape이
1. 서로 같다.
2. 둘 중 하나가 1이다.

의 두 가지 조건 중 한가지를 만족할 경우, 연산이 가능해집니다. (두 array가 다른 dimension를 가질 경우에는 자동으로 차원을 확장시켜 연산을 지원합니다.)

예를 들어, shape이 (3, 1)인 array와 shape이 (1, 4)인 array를 더할 수도 있습니다. (2번 조건을 만족하기 때문).  

그럼 연산은 어떤 방식으로 일어나는 것일까요? array를 stretch하여 일어난다고 이해하면 좋은데, [공식 documentation](https://numpy.org/devdocs/user/theory.broadcasting.html)의 다음 그림이 좋은 설명이 될 것 같습니다.

![stretched](/assets/images/210509/stretched.png)

그림을 보시면, 서로 다른 두 shape을 맞추기 위해, 개념적으로 array b를 stretch 하여 연산을 한 것을 알 수 있죠. 이와 같이 어떤 dimension의 shape가 1인 경우 그 dimension의 shape을 다른 array와 맞추기 위해 stretch(같은 값으로 복사하여 늘임)하는 것으로 **개념적으로** 이해할 수 있습니다.

개념적으로 라는 말을 강조한 것은, 실제로 stretch하여 값 복사가 일어나지는 않기 때문입니다. 그래서 일반적으로 broadcasting은 직접 tiling을 하는 것보다 time/memory cost 면에서 우수한 경우가 많습니다.

실제로 다음과 같은 코드를 실행해보면, 똑같은 기능을 수행함에도 시간 면에서 차이가 발생하는 것을 알 수 있습니다.

```python
import numpy as np
import time

a = np.ones([100000])
b = np.array([2])
c = np.tile(b, [100000])
sum0 = 0
sum1 = 0
t0 = time.time()
for _ in range(10000):
	a*b
t1 = time.time()
for _ in range(10000):
	a*c
t2 = time.time()

if (a*b).all() == (a*c).all():
	print(f'broadcasting: elapsed={t1-t0}s')
	print(f'w/o broadcasting: elapsed={t2-t0}s')
```
결과:
```
broadcasting: elapsed=0.33722591400146484s
w/o broadcasting: elapsed=1.0522308349609375s
```