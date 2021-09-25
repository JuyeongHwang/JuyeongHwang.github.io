---
layout: default
title: 0.Window API의 이해와 사용
parent: Direct3D/X11
nav_order: 1
---

나의 경우 directX를 처음 시작할 때, 무엇을 먼저 해야할지 많이 헤맸기 때문에 시작 부분에 대해 다루고자 이 글을 쓴다.
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Window API

### `<운영체제>`

유니티같은 게임엔진의 도움 없이 게임을 만들기 위해서 이해해야하는 첫번째 관문이다. 
운영체제는 키보드나 마우스의 입력, 모니터의 출력과 같은 컴퓨터를 구성하는 하드웨어를 컨트롤 할 수 있도록 도와준다.

시스템 사용자는 OS를 통해 하드웨어를 제어할 수 있게 되고, 운영체제는 사용자가 하드웨어에 접근할 수 있도록 API를 제공한다.

### `<응용 프로그램과 API>`

윈도우에서 돌아가는 프로그램(exe파일)들이 바로 응용 프로그램이다. 
응용 프로그램 개발자들이 각 운영체제에서 돌아가는 프로그램을 만들기 위해 운영체제가 제공하는 함수의 집합체를 API라고 한다.

윈도우에서 제공하는 API가 바로 `Window API`이다.

물론 직접적인 접근 권한을 주는 것은 아니고, 접근 가능한 메모리 주소값을 알려준다. 

### `<Handle>`

위에서 하드웨어에 접근할 수 있도록 한다고 하였지만, 직접 접근할 수 있는 것은 아니다.

user space에서 kernel space(운영체제 공간)으로는 포인터를 사용한 접근이 불가능하기 때문에 
주소를 사용하는 '포인터' 대신, '핸들'을 사용한다.

핸들은 리소스 주소를 정수로 치환한 값으로, 리소스는 운영체제가 관리하는 장치나 해당 장치를 사용하기 위해 필요한 정보이다.

### `<hInstance>`

'Handle'과 'Instance'의 합성어이다.
윈도우 OS에서 실행되는 프로그램을 구현하기 위핸 ID값이다.

만약 game1.exe와 chrome2.exe가 실행중이라면 이 두 프로그램을 구별하기 위한 ID라고 생각하면 된다.

### `<윈도우 객체>`

window os는 window 단위로 작업을 처리한다.

윈도우 객체의 경우, `Window Procedure`을 정의한 후 작업할 수 있다.
window procedure은 어떤 메세지가 발생한 경우 '어떻게' 처리할 것인지를 정의한 함수이다.

아래의 네모칸을 하나의 윈도우라고 생각해보자.
<div class="code-example" markdown="1">
[Link button](http://example.com/){: .btn }

[Link button](http://example.com/){: .btn .btn-purple }
[Link button](http://example.com/){: .btn .btn-blue }
[Link button](http://example.com/){: .btn .btn-green }

</div>

여러 버튼들이 있는데, 실제 프로그램에서는 각 버튼들이 다른 일들을 할 것이다. 눌렀을 때, 어떠한 행동을 할 것인지 메세지를 전달하고, 이 모든 버튼들은 하나의 Procedure을 공유한다.

### `<Window Procedure>`

- 메세지를 처리하는 함수
- 함수 포인터를 사용

---

## basic structure

보통 c++로 구현할 때, 아래와 같은 구조를 사용하였을 것이다.
메인 진입점을 구별하기 위함이다.

```c++
#include <stdio.h>

int main(){

    return 0;
}
```


이처럼, 윈도우 api의 진입점을 판단하기 위해 아래의 구조를 사용한다.

```c++
//windows 헤더 파일
#include <windows.h>

int WINAPI WinMain(HINSTANCE hInstance, 
HINSTANCE hPrevInstance,
LPSTR lpCmdLine,
int nShowCmd) 
{

}

```

---
# 진입점 만들기

## step1. WNDCLASSEX(윈도우 객체) 만들기

작동가능한 윈도우 창을 만들기 위한 첫번째 과정이다.


```c++

    WNDCLASSEX wc;
	wc.cbSize = sizeof(WNDCLASSEX);

	//CS_HREDRAW : 더블클릭으로 윈도우 조절 가능
	//CS_VREDRAW : 윈도우의 높이가 변하거나 수직으로 움직여도 다시 그려줌
	wc.style = CS_HREDRAW | CS_VREDRAW;

	wc.lpfnWndProc = WndProc;

	//WNDCLASSEX 생성 후에 추가적인 메모리 할당 수
	wc.cbClsExtra = NULL;
	//window instance 후에 추가적인 메모리 할당 수
	wc.cbWndExtra = NULL;

	//GetModuleHandle()
	wc.hInstance = hInstance;
	wc.hIcon = LoadIcon(NULL, IDI_WINLOGO);
	wc.hCursor = LoadCursor(NULL, IDC_ARROW);
	wc.hbrBackground = (HBRUSH)(COLOR_WINDOW + 2);
	wc.lpszMenuName = NULL;
	wc.lpszClassName = WndClassName;
	wc.hIconSm = LoadIcon(NULL, IDI_WINLOGO);

```

더 다양한 스타일은 msdn에 가면 있다.


## step2. 등록

만든 WNDCLASSEX를 등록한다.


```c++

	if (!RegisterClassEx(&wc)) {
		MessageBox(NULL, L"Error registering class", L"Error", MB_OK | MB_ICONERROR);
		return false;
	}

```

## step3. 만들기

최종적으로 우리의 창을 만들면 된다.


```c++

	hwnd = CreateWindowEx(
		NULL,
		WndClassName,
		L"Geometry Dash",
		WS_OVERLAPPEDWINDOW,
		CW_USEDEFAULT, CW_USEDEFAULT,
		width,
		height,
		NULL,
		NULL,
		hInstance,
		NULL);


	if (!hwnd) {
		MessageBox(NULL, L"Error creating window", L"Error", MB_OK | MB_ICONERROR);
		return false;
	}

```

## step4. 창을 보여주고 업데이트


```c++

	ShowWindow(hwnd, ShowWnd);
	UpdateWindow(hwnd);

```

---
# Procedure 만들기

```c++

LRESULT CALLBACK WndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
	switch (msg) {

	case WM_KEYDOWN:
		if (wParam == VK_ESCAPE) {
			if (MessageBox(0, L"Are you sure you want to exit?", L"Really?", MB_YESNO | MB_ICONQUESTION) == IDYES)
				DestroyWindow(hwnd);
		}
		return 0;

	case WM_DESTROY:
		PostQuitMessage(0);
		return 0;
	}

	return DefWindowProc(hwnd, msg, wParam, lParam);
}

```

간단한 구조이다. X 버튼을 누르면 진짜 끄겠냐는 화면이 나오고, yes를 누르면 꺼진다.

---


전체 코드를 적으면 아래와 같다.

```c++

#include <windows.h>

LPCTSTR WndClassName = L"firstWindow";
HWND hwnd = NULL;

const int Width = 800;
const int Height = 600;

//window 만들기 성공 : true, 아니면 false를 반환할 것임.
bool InitializeWindow(HINSTANCE hInstance, int ShowWnd, int width, int height, bool windowed);

//프로그램이 돌아갈 곳.
int messageloop();

// window callback procedure 설정.
// 윈도우의 메세지를 처리하는 곳
LRESULT CALLBACK WndProc(HWND hwnd, UINT msg, WPARAM wparam, LPARAM lParam);


///****< Main Windows Fuction >****///

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nShowCmd) {

	if (!InitializeWindow(hInstance, nShowCmd, Width, Height, true)) {

		MessageBox(0, L"Window Initialization - Failed", L"Error", MB_OK);

		return 0;
	}

	messageloop();


	return 0;
}


bool InitScene()
{
	return true;
}


/// <param name="hInstance"> This is the handle to our current application</param>
/// <param name="ShowWnd"> How the window should be displayed. Some common commands are SW_SHOWMAXIMIZED, SW_SHOW, SW_SHOWMINIMIZED.</param>
/// <param name="width"> Width of the window in pixels</param>
/// <param name="height"> Height of the window in pixels</param>
/// <param name="windowed"> False if the window is fullscreen and true if the window is windowed </param>
/// <returns></returns>
bool InitializeWindow(HINSTANCE hInstance, int ShowWnd, int width, int height, bool windowed) {


	//1. WNDCLASSEX 만들기
	WNDCLASSEX wc;
	wc.cbSize = sizeof(WNDCLASSEX);

	wc.style = CS_HREDRAW | CS_VREDRAW;

	wc.lpfnWndProc = WndProc;

	wc.cbClsExtra = NULL;
	wc.cbWndExtra = NULL;
	wc.hInstance = hInstance;
	wc.hIcon = LoadIcon(NULL, IDI_WINLOGO);
	wc.hCursor = LoadCursor(NULL, IDC_ARROW);
	wc.hbrBackground = (HBRUSH)(COLOR_WINDOW + 2);
	wc.lpszMenuName = NULL;
	wc.lpszClassName = WndClassName;
	wc.hIconSm = LoadIcon(NULL, IDI_WINLOGO);

	if (!RegisterClassEx(&wc)) {
		MessageBox(NULL, L"Error registering class", L"Error", MB_OK | MB_ICONERROR);
		return false;
	}

	hwnd = CreateWindowEx(
		NULL,
		WndClassName,
		L"Geometry Dash",
		WS_OVERLAPPEDWINDOW,
		CW_USEDEFAULT, CW_USEDEFAULT,
		width,
		height,
		NULL,
		NULL,
		hInstance,
		NULL);


	if (!hwnd) {
		MessageBox(NULL, L"Error creating window", L"Error", MB_OK | MB_ICONERROR);
		return false;
	}
	ShowWindow(hwnd, ShowWnd);
	UpdateWindow(hwnd);

	return true;
}

int messageloop() {

	//1. MSG 구조체 객체 만들기. This will hold the message's information.
	MSG msg;

	ZeroMemory(&msg, sizeof(MSG));

	/*
LPMSG lpMsg ; msg 포인터
HWND hwnd ; 메세지를 보내는 윈도우의 핸들.
UINT wMsgFilterMin ; 메세지 범위 중(message quere 얘기하는 듯) 첫 메세지의 값이 조사되었는지 확인하고,
wMsgFilterMin과 wMsgFilterMax가 둘다 0이라면, PeekMessage는 모든 메세지를 조사할 것이다.
UINT wMsgFilterMax ; 메세지 큐 중 마지막 값을 확인한다.
UINT wRemoveMsg ; 메세지가 어떻게 관리되는지에 관한 변수. 우리가 PM_REMOVE로 세팅하면 메세지는 읽힌 후, 삭제될 것이다.
*/

	while (true)
	{
		if (PeekMessage(&msg, NULL, 0, 0, PM_REMOVE))
		{
			if (msg.message == WM_QUIT) {
				break;
			}

			TranslateMessage(&msg); //키보드의 virtual key를 characters로 변환하는 것같은 역할
			DispatchMessage(&msg); //보낸다 메세지를. 우리의 window precedure에게.(WndProc)

		}

		else {
			//run game code
		}
	}

	return (int)msg.wParam;
}

/// <param name="hwnd">
/// the handle to the window that got the message.
/// </param>
/// <param name="msg">
/// the contents of the message.
/// </param>
/// <param name="wParam", "lParam">
/// wParam and lParam are extra information about the message.
/// we will be using wParam to detect keyboard input.
/// </param>
LRESULT CALLBACK WndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
	switch (msg) {

	case WM_KEYDOWN:
		if (wParam == VK_ESCAPE) {
			if (MessageBox(0, L"Are you sure you want to exit?", L"Really?", MB_YESNO | MB_ICONQUESTION) == IDYES)
				DestroyWindow(hwnd);
		}
		return 0;

	case WM_DESTROY:
		PostQuitMessage(0);
		return 0;
	}

	return DefWindowProc(hwnd, msg, wParam, lParam);
}


```