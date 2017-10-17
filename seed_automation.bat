git clone https://github.com/syncfusion/angular2-seeds.git angulartestseed -b master
xcopy seedsrc\package\*.* angulartestseed\ /s /y /i 
xcopy seedsrc\e2e\*.* angulartestseed\e2e\ /s /y /i 
xcopy seedsrc\gulp\*.* angulartestseed\ /s /y /i 
xcopy seedsrc\tsconfig\*.* angulartestseed\src\ /s /y /i 

cd angulartestseed

call npm install

call node_modules\.bin\gulp start > gulp_start.txt

cd..
call "test.bat"

cd angulartestseed
call node_modules\.bin\gulp mail> gulp_mail.txt


