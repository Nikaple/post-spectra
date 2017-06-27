# Post Spectra

## [在线预览](https://nikaple.github.io/) （暂不兼容`IE`浏览器）

## For an English version of readme, click [here](https://github.com/Nikaple/post-spectra/blob/master/README-en.md).

## 太长不看

 本程序能接收两种数据：
 - 原始数据——用于格式化；
 - 已处理的数据——用于检测。

## 基本使用

### 选项说明

#### - 将非d, t, q峰当做m峰处理：将除了d,t,q以及br d这四种峰型当做多重峰(m)处理，默认关闭。

#### - 自动校正J值：自动将耦合常数的数值(mHz)修正为仪器频率(MHz)的倍数，例如：在400 MHz氢谱中，J = 7.7 Hz会被自动修正为J = 7.6 Hz，而在600 MHz氢谱中J = 7.7则会被修正位J = 7.8 Hz，默认开启。

#### - 严格模式：在严格模式下会对氢谱、碳谱以及部分高分辨的数据及其格式格式进行检测，而非严格模式下只会检查数据而不检查格式，默认开启。（详见下）

#### - 自动复制：开启之后在每次输入后会自动复制，默认关闭。（当做原始数据处理时比较有用）

### NMR 数据处理

#### <sup>1</sup>H NMR 原始数据处理

在谱图软件`MestReNova`中处理好谱图后，选中氢谱，在工具中单击`Multiplets Analysis`图标显示耦合常数，再在其下拉菜单中选择`Copy`。随后切换到浏览器界面，将刚刚所复制的数据粘贴在屏幕左侧的文本框中，然后到`Word`中粘贴即可。**（复制一次，粘贴两次）**

#### <sup>13</sup>C NMR 原始数据处理

在谱图软件`MestReNova`中处理好谱图后（记得**定标**），选中碳谱，在工具栏`Peak Peaking`的下拉菜单中选择`Copy`。随后切换到浏览器界面，将刚刚所复制的数据粘贴在屏幕左侧的文本框中，然后到`Word`中粘贴即可。**（复制一次，粘贴两次）**

### NMR 数据检测

将已处理的谱图数据直接粘贴至`NMR`数据处理的文本框后，根据输出框高亮部分寻找错误来源。
 - 未加粗：系统未识别输入的数据，请检查数据头尾是否正确。
 - 绿色高亮： 
    - 在**严格模式**下，表明该数据可直接使用，完全无误；
    - 在**非严格模式**下，表明数据无误，但可能存在格式问题。（复制到剪贴板的数据格式正确，可以直接粘贴使用）
 - 黄色高亮：此部分数据已被修改；
 - 红色高亮：此信息有误（参考错误信息）；
 - 仅显示错误信息：
   - 谱图数据格式不正确：请检查数据是否以<sup>**1**</sup>**H/**<sup>**13**</sup>**C NMR**开头，在严格模式下必须以**英文句号**或**英文分号**结尾(`.`或`;`)；
   - 频率或溶剂信息有误：请检查**频率**与**溶剂**信息

### NMR 数据基本格式

  - 氢谱的峰值保留两位小数，碳谱保留一位；
  - 数值与符号之间需要有且只有一个空格（百分号除外）；
  - 同一单位的数据在连写时只用写一个单位
    - √ 7.2, 2.0 Hz
    - × 7.2 Hz, 2.0 Hz
  - 加号、等号两端都要有空格，连字符可以选择两端加或者两端均不加空格。

### HRMS 数据检测

本部分的数据规范来源于JOC style guide. 在标准的描述信息中，提供的化学式应为测试分子加上H或者Na的结果。例如，苯的HRMS信息应被报道为：HRMS (ESI/QTOF): m/z [M + H]<sup>+</sup> Calcd for C<sub>6</sub>H<sub>7</sub>, 79.0542; Found 79.0569.

> The reported molecular formulas and Calcd values should include any added atoms (usually H or Na). For example, HRMS (ESI/QTOF) m/z: [M + Na]+ Calcd for C13H17NO3Na, 258.1101; Found 258.1074.  ---- Journal of Organic Chemistry Style Guide

> A Found value within 0.003 m/z unit of the Calcd value of a parent-derived ion, together with other available data (including knowledge of the elements present in reactants and reagents) is usually adequate for supporting a molecular formula for compounds with molecular masses below 1000 amu.  ---- Journal of Organic Chemistry Style Guide

由于HRMS测试的方法众多，而各课题组对数据的描述也不尽相同，故在此只对仪器信息与单词拼写、格式做较基本的检测，**检测通过的数据不保证可以直接使用**。检测的数据有如下几种：
  - 离子源只进行基本检测，描述的离子源中只要含有ESI, APCI, EI, MALDI, CI, FD, FI, FAB, APPI, TS, PB, DART等常见离子源即为通过（未对质量分析器以及检测器的合理性进行检测）；
  - 对于描述的化学式与理论值匹配程度的检测：差值小于0.0001为合格，也就是只允许末位出现1的偏差；
  - 对于实验值的检测：与理论值偏差在±0.003即视为合格。

### 规范数据示例

  <sup>1</sup>H NMR (600 MHz, CDCl<sub>3</sub>): δ = 11.43 (s, 1H), 8.28 (d, J = 6.0 Hz, 1H), 7.81 (dd, J = 7.8, 2.4 Hz, 3H), 7.67 (q, J = 8.4 Hz, 1H), 7.38 (br, 1H), 7.24 - 7.01 (m, 1H), 6.70–6.62 (m, 3H), 5.58−5.30 (m, 3H); <sup>13</sup>C NMR (100 MHz, CDCl<sub>3</sub>): δ (ppm) = 144.4, 133.5(1), 133.5(2), 130.8(2C), 129.81, 129.79, 127.62, 127.42; HRMS (ESI): m/z [M + Na]<sup>+</sup> Calcd for C<sub>9</sub>H<sub>14</sub>BrN<sub>3</sub>Na, 266.0263; Found 266.0236.

### 原始数据示例

  1H NMR (400 MHz, dmso-d6) δ 8.01 (br s, 1H), 7.24-7.18 (m, 2H), 6.94 (d, J = 5.3 Hz, 1H), 6.88 (s, 1H), 3.42 (dd, J = 14.4, 5.0 Hz, 1H), 3.10-3.06 (m, 2H), 2.76 (dd, J = 14.0, 12.0 Hz, 1H), 2.66 (d, J = 12.8 Hz, 1H), 2.51 (s, 3H), 2.20 (td, J = 10.8, 4.0 Hz, 1H), 2.18-2.10 (m, 1H), 1.95 (t, J = 11.2 Hz, 1H), 1.12 (q, J = 12.4 Hz, 1H), 1.02 (d, J = 6.8 Hz, 3H); 13C NMR (100 MHz, dmso-d6) δ 133.6, 133.3, 126.2, 123.0, 117.6, 113.2, 112.0, 108.4, 67.0, 65.4, 43.2, 40.8, 39.93, 39.80, 39.66, 39.52, 39.38, 39.24, 39.10, 36.4, 30.6, 26.9, 19.7;

-------------------------------------------------------

### Word设置

#### 设置默认粘贴方式

在`Word`中选择文件→选项→高级，从其他程序粘贴设置为`合并格式`，即可默认以`合并格式`粘贴外部信息到`Word`中，省去手动更改格式的步骤。

-------------------------------------------------------

### 帮助改进

[点击这里](https://github.com/Nikaple/chem-si-helper/issues)， 提交一个新Issue，请注明所输入的数据以及期望获得的结果。

-------------------------------------------------------

## Install locally

### 直接下载

在当前页面靠近顶部的位置，找到```Clone or download```，点击```Download ZIP```，之后解压下载好的文件并打开```index.html```即可

### Contribute

Any contribution will be appreciated. To help improve the project, you can clone this repository and open a pull request, or even open an issue is fine.

After installing [NodeJS](https://nodejs.org) and [Git](https://git-scm.com/), run:
```
git clone https://github.com/Nikaple/chem-si-helper.git
cd chem-si-helper
npm install
npm start
```


## LICENCE

MIT