<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	</head>
	<body>
		
		<?php
    		require 'mysql.php';
    		$db = Database::initDB();
    		$result = $db->query("SELECT start_time FROM reserve");
    		$h=date(H)+8+1;
    		if($h>=24){$h-=24;}
    		$i = $h;
    		$rs = $result -> fetch();
    		echo "<table style='width:100%' style='font-size:36px;' border-collapse='collapse' border='1px solid black'><tr><td align='center' style='font-size:36px;'>時間</td><td align='center' style='font-size:36px;'>預約狀況</td></tr>";
    			
    			do{
    			$i_str = $i;
    			if(strlen($i_str . "")==1){
    				$i_str = "0" . $i_str;
    			}
    			echo "<tr><td align='center' style='font-size:36px;'>" . $i_str . ":00~" . $i_str . ":59</td><td align='center'";
    			if($i_str==substr($rs[start_time],0,2)){
    				echo " bgcolor='#FF0000'";
    			}
    			$i++;
    			if($i>=24){
    				$i-=24;
    			}
    			echo "></td></tr>";
    		}while($i!=$h);
    		echo "</table>";
    		$db="";
		?> 
	</body>
</html>