# Chemical Supporting Information Helper

## [在线预览](https://nikaple.github.io/) （暂不兼容`IE`浏览器）

## 太长不看

### 本程序能接收两种数据：原始数据——用于格式化，或已处理的数据——用于检测。

## 基本使用

### NMR 数据处理

#### <sup>1</sup>H NMR 原始数据处理

在谱图软件`MestReNova`中处理好谱图后，选中氢谱，在菜单栏中单击Multiplets Analysis显示耦合常数，再在其下拉菜单中选择`Copy`。随后切换到浏览器界面，将刚刚所复制的数据粘贴在屏幕左侧的文本框中，然后到`Word`中粘贴即可。**（复制一次，粘贴两次）**

#### <sup>13</sup>C NMR 原始数据处理

在谱图软件`MestReNova`中处理好谱图后（记得**定标**），选中碳谱，在菜单栏中`Peak Peaking`的下拉菜单中选择`Copy`。随后切换到浏览器界面，将刚刚所复制的数据粘贴在屏幕左侧的文本框中，然后到`Word`中粘贴即可。**（复制一次，粘贴两次）**

### NMR 数据检测

将已处理的谱图数据直接粘贴至`NMR`数据处理的文本框后，根据输出框高亮部分寻找错误来源。
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
  - 等号、连字符等符号两端都要有空格。

### HRMS 数据检测

本部分的数据规范来源于JOC style guide. 在标准的描述信息中，提供的化学式应为测试分子加上H或者Na的结果。例如，苯的HRMS信息应被报道为：HRMS (ESI/QTOF): m/z [M + H]<sup>+</sup> Calcd for C<sub>6</sub>H<sub>7</sub>, 78.0542; Found 78.0569. 但由于HRMS测试的方法众多，而各课题组对数据的描述也不尽相同，故在此只对仪器信息与单词拼写、格式做较基本的检测，检测通过的数据不保证可以直接使用。

> The reported molecular formulas and Calcd values should include any added atoms (usually H or Na). For example, HRMS (ESI/QTOF) m/z: [M + Na]+ Calcd for C13H17NO3Na, 258.1101; Found 258.1074.  ---- Journal of Organic Chemistry Style Guide

> A Found value within 0.003 m/z unit of the Calcd value of a parent-derived ion, together with other available data (including knowledge of the elements present in reactants and reagents) is usually adequate for supporting a molecular formula for compounds with molecular masses below 1000 amu.  ---- Journal of Organic Chemistry Style Guide

### 规范数据示例

  Yield 78% (174.8 mg); yellow solid; mp 85-87 °C; IR (KBr): 3448, 1555, 1459, 1430, 1229, 1129, 1074, 1025 cm<sup>-1</sup>; 1H NMR (600 MHz, CDCl<sub>3</sub>): δ = 11.43 (s, 1H), 8.28 (d, J = 6.0 Hz, 1H), 7.81 (dd, J = 7.8, 2.4 Hz, 3H), 7.67 (q, J = 8.4 Hz, 1H), 7.38 (br, 1H), 7.24 - 7.01 (m, 1H), 6.70–6.62 (m, 3H), 5.58−5.30 (m, 3H); 13C NMR (100 MHz, CDCl<sub>3</sub>): δ (ppm) = 144.4, 133.5(1), 133.5(2), 130.8(2C), 129.81, 129.79, 127.62, 127.42; HRMS (ESI): m/z [M + Na]<sup>+</sup> Calcd for C<sub>8</sub>H<sub>14</sub>BrN<sub>3</sub>Na, 245.9637; Found 245.9633.

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