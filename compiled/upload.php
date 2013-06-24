<?php
if ($_FILES){
  if ($_FILES['file']['error'] > 0){
    echo '<span class="error">Error: ' . $_FILES['file']['error'] . '</span><br /><hr /><br />';
  } else {
    move_uploaded_file($_FILES['file']['tmp_name'], 'assets/map.tmx');
    echo '<span class="success">Guardado : ' . $_FILES['file']['name'] . '</span><br /><hr /><br />';
  }
}
?>
<html>
  <head>
    <title>Upload TMX file</title>
    <style type="text/css">
      body {width:100%; height:100%; font-size:16px; font-family:"Courier New", Courier, monospace; text-align:center; color:#000;}
      .clearfix, .clearfix:after {float:none; clear:both;}
      .clearfix:before, .clearfix:after {content:" "; display:block; height:0; visibility:hidden;}
      .error{color:#700;}
      .success{color:#070;}
      form{position:relative; width:310px; color:#000; margin:0 auto 0 auto;}
        form label{display:block; position:relative; padding:20px 0 5px 0;}
        form input{display:block; position:relative; width:300px;}
        form textarea {display:block; position:relative; width:300px;}
        form input[type=submit]{width:60px; margin:15px auto}
    </style>
  </head>
  <body>
    <form action="upload.php" method="post" enctype="multipart/form-data">
      <label for="file">Subir archivo .tmx:</label><br />
      <input type="file" name="file" id="file" /><br /><br />
      <input type="submit" name="submit" value="Submit" />
    </form>
  </body>
</html>