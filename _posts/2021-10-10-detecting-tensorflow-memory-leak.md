---
layout: single
title:  "TensorFlow 2.x 사용시 발생하는 memory leak 해결"
date:   2021-10-11
categories: TensorFlow
toc: false
---
TensorFlow 2.x에서 custom training loop을 작성하여 train을 진행하다 보면, epoch이나 step이 진행됨에 따라 memory occupation이 조금씩 증가하는 경우가 종종 발생합니다. 그 중 제가 마주했던 2가지 원인들을 간략히 소개합니다.

## 1. tf.function으로 데코레이팅된 함수 호출 시 발생하는 re-tracing 문제
tf.function으로 데코레이팅된 함수가 python-native parameter를 가지면, 해당 parameter가 바뀌어 호출될 때마다 함수가 re-tracing되며 새로운 메모리가 할당됩니다. 아래는 TensorFlow docs에서 발췌한 코드입니다.
``` python
import tensorflow as tf

@tf.function
def train(num_steps):
  print("num_steps = {}".format(num_steps))
  for _ in tf.range(num_steps):
    train_one_step()

train(num_steps=10)
train(num_steps=20)
``` 
**결과)**
``` 
num_steps = 10
num_steps = 20
``` 

print문이 2번 호출되는 것(tracing이 2번 발생하는 것)을 확인할 수 있습니다. 이를 해결하기 위해서는 
1. python-native parameter의 가능한 state가 적은 함수만 tf.function으로 데코레이팅하여 메모리 사용을 최소화한다.
2. numerical value들을 tensor로 바꾸어 호출한다. (tf.constant를 이용)  

와 같은 방법을 시도해볼 수 있습니다.

## 2. system malloc의 비효율성 문제
[TensorFlow Issue](https://github.com/tensorflow/tensorflow/issues/44176#issuecomment-783768033)에 제기된 바와 같이, TensorFlow에서 기본으로 사용하는 system malloc의 비효율성으로 인해 dataset을 iterate하기만 해도 memory leak이 발생하는 이슈가 존재합니다. 많은 횟수의 allocation/deallocation이 반복됨에 따라 memory leak이 발생하는 것으로 보입니다.  

해결책은 google에서 개발한 [TCMalloc](https://github.com/google/tcmalloc)을 사용하는 것입니다. 사용법은 다음과 같습니다.
1. sudo apt-get install libtcmalloc-minimal4 로 tcmalloc 설치
2. dpkg -L libtcmalloc-minimal4 로 shared library 경로 확인 (libtcmalloc_minimal.so.4)
3. LD_PRELOAD={2번에서 찾은 경로} 를 실행하고자 하는 명령어 앞에 붙이기

단순히 system malloc을 tcmalloc으로 교체하는 것만으로도 memory leak이 쉽게 해결됩니다.

