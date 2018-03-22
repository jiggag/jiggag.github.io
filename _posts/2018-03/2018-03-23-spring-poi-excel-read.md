---
layout: post
published: true
title: 스프링 poi.jar를 이용한 엑셀 읽어오기
subtitle: spring maven, pom.xml에 추가
tags: [spring,maven,poi,jar,excel]
---

스프링에서 apache poi 라이브러리를 추가하여 엑셀의 내용을 읽어오자

## 스프링 메이븐 라이브러리 추가

스프링 메이븐에서 jar, 이 라이브러리를 사용하고자하면 pom.xml의 dependencies에 추가해줘야한다.

```
# pom.xml에 아래와 같이 라이브러리를 추가
<dependency>
	<groupId>org.apache.poi</groupId>
	<artifactId>poi</artifactId>
	<version>3.11</version>
</dependency>

```

pom.xml에 추가하고 나면 잠시후 maven dependences에 poi-3.11이라는 jar파일이 추가된것을 볼 수 있다.
그럼 이제 poi api에서 지원하는 엑셀의 내용을 읽어오는 기능을 사용해보자


## 엑셀 파일 읽어오기

```

# 엑셀 파일 경로에 접근
FileInputStream file = new FileInputStream("d:\\excelread.xlsx");

# 해당 엑셀 파일의 시트 가져오기
XSSFWorkbook workbook = new XSSFWorkbook(file);

# 시트 이름으로 읽기
XSSFSheet sheet = workbook.getSheet("sheet name");

# 존재하는 시트 수 만큼 for문
XSSFSheet sheet = null;
for(int i=0 ; i<workbook.length ; i++){
	sheet = workbook.getSheetAt(i);
}

# 해당 시트의 행의 수를 구하고 읽기
# 단, 행이 빈칸없이 채워져 있는 경우
int rows = sheet.getPhysicalNumberOfRows();
for(int j=0 ; j<rows ;j++){
	XSSFRow row = sheet.getRow(j);
}


# 해당 행에 존재하는 셀의 수를 구하고 읽기
int cells = row.getPhysicalNumberOfCells();
for(int k=0 ; k<cells ;j++){
	XSSFCell cell = row.getCell(k);
}

# 셀의 타입별로 내용 읽고 출력

switch (cell.getCellType()){
case XSSFCell.CELL_TYPE_FORMULA:
	value=cell.getCellFormula();
	break;
case XSSFCell.CELL_TYPE_NUMERIC:
	value=cell.getNumericCellValue()+"";
	break;
case XSSFCell.CELL_TYPE_STRING:
	value=cell.getStringCellValue()+"";
	break;
case XSSFCell.CELL_TYPE_BLANK:
	value=cell.getBooleanCellValue()+"";
	break;
case XSSFCell.CELL_TYPE_ERROR:
	value=cell.getErrorCellValue()+"";
	break;
}
System.out.println(value);

```

## 엑셀 파일 읽어오기 예시

```

FileInputStream file = new FileInputStream("d:\\excelread.xlsx");
XSSFWorkbook workbook = new XSSFWorkbook(file);
XSSFSheet sheet = null;

for(int i=0 ; i<workbook.length ; i++){
	sheet = workbook.getSheetAt(i);
	int rows = sheet.getPhysicalNumberOfRows();

	for(int j=0 ; j<rows ;j++){
		XSSFRow row = sheet.getRow(j);
		int cells = row.getPhysicalNumberOfCells();

		for(int k=0 ; k<cells ;j++){
			XSSFCell cell = row.getCell(k);

			switch (cell.getCellType()){
			case XSSFCell.CELL_TYPE_FORMULA:
				value=cell.getCellFormula();
				break;
			case XSSFCell.CELL_TYPE_NUMERIC:
				value=cell.getNumericCellValue()+"";
				break;
			case XSSFCell.CELL_TYPE_STRING:
				value=cell.getStringCellValue()+"";
				break;
			case XSSFCell.CELL_TYPE_BLANK:
				value=cell.getBooleanCellValue()+"";
				break;
			case XSSFCell.CELL_TYPE_ERROR:
				value=cell.getErrorCellValue()+"";
				break;
			}
			System.out.println(i + "번 시트 : " + j + "행의 " + k + "열 = " + value);
		}
	}
}

```