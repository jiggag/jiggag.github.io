---
layout : post
published : true
title : 안드로이드 카드게임
subtitle : 토이2 뇌순발력 카드게임
tags : [android,toy]
---

## 많이 놀았다
첫번째로 만든 계산기 수정은 미뤄두고 계속 놀았다.

세상엔 참 많은 놀거리가 있다.

연말인데 그동안을 돌아보며 화장실에서 갑자기 생각난 카드 형식의 미니 게임

*화장실처럼 집중하기 좋은 곳이 따로없다*


## 안드로이드 카드게임

- 문제는 사칙연산
- 정답은 카드로 여러장 제시
- 카운트다운
- 난이도에 따라 사칙연산 후 해당하는 값(계산, 앞, 뒤, 앞+뒤 숫자)

먼저 랜덤 숫자로 문제를 생성하고 정답을 계산
사칙연산에 따라 보기 생성방식을 다르게 하였다
보기 버튼 생성 후 각각 텍스트 적용하였고 클릭이벤트 발생 시 정답을 체크

#### MainActivity.java
```java

    /*
    NOTE 2018-12-29
    문제 생성 : 랜덤 수 2개, 사칙연산
    
    NOTE 2018-12-30
    보기 생성 : 덧셈뺄셈, 곱셈나눗셈에 따른 보기방식
    
    NOTE 2019-01-01
    보기 버튼 생성 : 클릭 시 정답 여부 체크
    
    NOTE 2019-01-04
    상단에 현재 게임 정보 표시
    난이도별 연산자 선택
    레벨별 최소 획득 점수 설정
    */

    int answer;
    int exArr[];
    
    private void init() {
	
        TextView gameInfo = (TextView) findViewById(R.id.info);
        gameInfo.setText("게임 레벨 : " + level + " / 획득 가능한 점수 : " + point + " / 누적 : " + score);

        int random1 = (int) (Math.random() * 10 + (1 * (int) (level / 10)));
        int random2 = (int) (Math.random() * 10 + (1 * (int) (level / 10)));
	
        int operator = 0;	
        if (level < 50) {
            operator = (int) (Math.random() * 1);
        } else if (level >= 50 && level < 100){
            operator = (int) (Math.random() * 2);
        } else if (level >= 100 && level < 200){
            operator = (int) (Math.random() * 3);
        } else if (level >= 200){
            operator = (int) (Math.random() * 4);
        }
        String[] operatorArr = {"+", "-", "*", "/"};
        
	// 정답
	answer = calc(random1, random2, operator);
        exArr = calcEx(operator, answer);
	
        TextView textPreview = (TextView) findViewById(R.id.quiz);
        textPreview.setText(quiz(random1, random2, operatorArr[operator]));

/*
        TextView answerPreview = (TextView) findViewById(R.id.answer);
        answerPreview.setText("정답 : " + answer);

        TextView exPreview = (TextView) findViewById(R.id.ex_btn);
        exPreview.setText("보기 : " + exArr[0] + " / " + exArr[1] +" / " + exArr[2] +" / "
                + exArr[3] +" / " + exArr[4] +" / " + exArr[5] + " / "
                + exArr[6] +" / " + exArr[7] +" / " + exArr[8]);
*/

	// 보기 버튼
	Button one = (Button) findViewById(R.id.btn_one);
        Button two = (Button) findViewById(R.id.btn_two);
        Button three = (Button) findViewById(R.id.btn_three);
        Button four = (Button) findViewById(R.id.btn_four);
        Button five = (Button) findViewById(R.id.btn_five);
        Button six = (Button) findViewById(R.id.btn_six);
        Button seven = (Button) findViewById(R.id.btn_seven);
        Button eight = (Button) findViewById(R.id.btn_eight);
        Button nine = (Button) findViewById(R.id.btn_nine);
        one.setText("" + exArr[0]);
        two.setText("" + exArr[1]);
        three.setText("" + exArr[2]);
        four.setText("" + exArr[3]);
        five.setText("" + exArr[4]);
        six.setText("" + exArr[5]);
        seven.setText("" + exArr[6]);
        eight.setText("" + exArr[7]);
        nine.setText("" + exArr[8]);
        one.setOnClickListener(btnListener);
        two.setOnClickListener(btnListener);
        three.setOnClickListener(btnListener);
        four.setOnClickListener(btnListener);
        five.setOnClickListener(btnListener);
        six.setOnClickListener(btnListener);
        seven.setOnClickListener(btnListener);
        eight.setOnClickListener(btnListener);
        nine.setOnClickListener(btnListener);

    }

    private String quiz(int ran1, int ran2, String operator){
        return ran1 + " " + operator + " " + ran2 + " = ?";
    }

    private int calc(int ran1, int ran2, int operator){
      int answer = 0;
      if(operator == 0){
        answer = ran1 + ran2;
      }else if(operator == 1){
        answer = ran1 - ran2;
      }else if(operator == 2){
        answer = ran1 * ran2;
      }else if(operator == 3){
        answer = ran1 / ran2;
      }else{
        // 에러 발생
      }
          return answer;
    }
    
    private int[] calcEx(int operator, int answer){
        int exArr[] = new int[9];
        
        // 정답의 위치 난수 생성
        int m = (int) (Math.random() * 9);
        
        // 덧뺄셈 : 정답 +-1
        // 곱나눗셈 : 정답 +-10
        if(operator == 0 || operator == 1){
           for(int i = 0 ; i < 9 ; i++){
               exArr[i] = answer + i - m;
           }
        }else if(operator == 2 || operator == 3){
            for(int i = 0 ; i < 9 ; i++){
                exArr[i] = answer + (i - m)*10;
            }
        }else{
            // 에러 발생
        }
        return exArr;
    }
    
    // 정답 체크
    private void checkAnswer(int answer, int submit){
        boolean check = false;
        if(answer == submit){
            check = true;
        }

        // 정답이면 다음문제
        if(check){
            // + 점수
            score();
            init();
        }else{
            // - 점수
            fail();
        }
    }

    public View.OnClickListener btnListener = new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            switch (view.getId()) {
                case R.id.btn_one:
                    checkAnswer(answer, exArr[0]);
                    break;
                case R.id.btn_two:
                    checkAnswer(answer, exArr[1]);
                    break;
                case R.id.btn_three:
                    checkAnswer(answer, exArr[2]);
                    break;
                case R.id.btn_four:
                    checkAnswer(answer, exArr[3]);
                    break;
                case R.id.btn_five:
                    checkAnswer(answer, exArr[4]);
                    break;
                case R.id.btn_six:
                    checkAnswer(answer, exArr[5]);
                    break;
                case R.id.btn_seven:
                    checkAnswer(answer, exArr[6]);
                    break;
                case R.id.btn_eight:
                    checkAnswer(answer, exArr[7]);
                    break;
                case R.id.btn_nine:
                    checkAnswer(answer, exArr[8]);
                    break;
            }
        }
    };

    private void score(){
        score += point;
    }
    
    private void score(){
        score += point;

    }

    // 오답 클릭 시 얻을 수 있는 점수 감소
    private void fail(){
        // 레벨별 최소 획득 점수
        if((point*0.5) >= (level * 10)){
            point *= 0.5;
        }else{
            point = level * 10;
        }
    }

    
```

#### AndroidManifest.xml
```xml

        <!-- NOTE 2019-01-01 : screenOrientation를 추가하여 앱 화면 세로로 고정-->
        <activity android:name=".MainActivity" android:screenOrientation="portrait">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
```

#### 글이 안올라가는 경우
- title, subtitle에 괄호가 있으면 안되는것같다
- 수정했는데도 레이아웃이 적용되지 않아 : 사이를 띄워주었더니 되었다

***수정***
