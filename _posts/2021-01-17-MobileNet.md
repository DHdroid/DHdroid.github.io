---
layout: single
title:  "[CV] MobileNet V1"
date:   2021-01-17
categories: CV
toc: true
---

 딥러닝 모델에서, 성능만큼 중요한 것이 **모델의 크기와 연산량**입니다. 파라미터를 잔뜩 늘린다면 높은 성능에 도달할 수는 있겠지만, 실제 device에서 사용할 수 없을 정도로 파라미터가 많고 latency가 크다면 실용성 면에서 좋은 평가를 받을 수 없겠죠. 오늘 살펴볼 모델은 mobile device에도 올라갈 수 있을만큼 가볍지만, 무시할 수 없는 성능을 기록한 MobileNet V1입니다(물론 당시 기준입니다). 

# MobileNet V1
MobileNet V1에서는 Depthwise Separable Convolution을 통해 연산량이 낮으면서도, 성능이 훌륭한 모델 구조를 제시했습니다. 또한, width multiplier와 resolution multiplier를 도입해 효율적인 model scaling 방법론을 함께 제시했습니다.
## Depthwise Separable Convolution
MobileNet V1에서는, 기존 Convolution 연산을 **Depthwise Separable Convolution**으로 대체했습니다.
w x h x c input에 3x3 convolution 연산을 해서 w x h x c' output을 얻고 싶다고 합시다.

**기존의 convolution 연산**은 3 x 3 x c짜리 filter를 c'개 사용하여 output을 얻습니다. filter는 spatial한 정보와, channel별 정보를 동시에 고려하여 주요 feature를 추출합니다.

이에 반해 **Depthwise Separable Convolution**은 spatial한 정보는 Depthwise Convolution으로, channel별 정보는 Pointwise Convolution으로 추출합니다. 위의 예시로 설명하자면 다음과 같습니다.
1. Depthwise convolution: w x h x c input에 channel 별로 3x3 filter convolution을 각기 따로 적용합니다. (3x3 filter가 c개)
2. Pointwise convolution: Depthwise convolution의 output에 1x1 filter convolution을 적용하여 channel별 정보를 aggregate하여 새로운 pointwise vector를 얻습니다.

위와 같은 방식으로 기존의 convolution 연산을 두 차원(depthwise, pointwise)으로 factorize한 것이 Depthwise Separable Convolution이며, MobileNetV1의 핵심 building block입니다.

### Computational Cost
H x W x C input을 받아 F x F kernel size로 H x W x C' output을 출력하는 convolution layer에서

1. 기존 Convolution: H * W * F * F * C * C'  
2. Depthwise Separable Convolution: H * W * F * F * C (Depthwise) + H * W * C * C' (Pointwise)  


의 Cost를 필요로 합니다.

Depthwise Separable Convolution의 연산량이 기존 Convolution에 비해 1/C' + 1/K^2 배 밖에 되지 않는다는 것입니다. 흔히 사용하는 K=3인 filter라면, 약 8~9배의 연산을 아낄 수 있습니다.

### MobileNet V1 Block
![dwsep](/assets/images/210117/dwsep.png){: .center}  
각 layer끝에 Batch Normalization과 ReLU가 배치되어 있습니다.

## Architecture
![mobilenet_v1](/assets/images/210117/mobilenet_v1.png)  
3x3 depthwise와 1x1 pointwise convolution이 반복되는 구조를 확인할 수 있습니다. VGG와 유사하면서도 pooling대신 stride를 사용하였다는 점과 depthwise separable convolution을 이용한 것이 눈에 띕니다.
## Performance
![performance](/assets/images/210117/performance.png)
당시 나름 좋은 디자인의(?) 모델로 평가받던 GoogleNet이나 VGG16보다 훨씬 적은 파라미터로 더 좋은 성능을 기록했으며, 적절히 scaling한 모델은 비교적 작은 크기의 모델인 AlexNet이나 Squeezenet보다도 더 적은 연산 및 파라미터로 좋은 성능을 달성했습니다.
## Multipliers
논문에서는 간단하면서도 효율적인 scaling 방법으로 두 가지 multiplier를 활용하는 것을 제안합니다.
## Width Multiplier
width multiplier는 channel width를 결정하는 multiplier입니다. width multiplier α에 대해 모든 convolution layer의 input과 output channel을 α배 하는 방식으로 모델을 scaling합니다. depthwise conv보다는 pointwise conv가 computationally 훨씬 더 큰 비중을 차지하기 때문에 width multiplier α는 computational cost를 대략 α^2배 만큼 줄여줍니다(논문에서는 α = 0.25, 0.5, 0.75, 1.0을 제시합니다). 논문에서는 width를 조절하는 것이 depth를 조절하는 것에 비해 더 효율적인 scaling 방법임을 실험적으로 증명해놓았습니다.
## Resolution Multiplier
resolution multiplier는 input image의 resolution을 결정하는 multiplier입니다. 파라미터 수에는 영향을 주지 않는다는 것이 특징입니다(Global pooling이 있으므로). Width multiplier와 마찬가지로 연산량이 제곱에 비례하게 늘어납니다.
<br/>  
<br/>  
<br/>  
# 생각
흔히 dimensionality reduction에 사용되던 idea인 factorization을 convolution에 끌어온 것이 흥미롭습니다. 그런데 multiplier는 약간은 거창(?)한 이름을 붙인 것 같네요. 더 효율적인 search space를 제시했다 정도면 좋았을 것 같습니다. 다음에는 bottleneck에 대한 새로운 해석을 제시한 MobileNet V2를 이어서 리뷰해보겠습니다!