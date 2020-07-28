<?php
$nCONST_NO_DATA = -500;

function getElevation( $worldCoordX, $worldCoordY
    , $zoom, $demSource, $dataRound )
{
  global $nCONST_NO_DATA;

  $PixelX = $worldCoordX * pow( 2, $zoom );
  $TileX = floor( $PixelX / 256 );
  $PixelY = $worldCoordY * pow( 2, $zoom );
  $TileY = floor( $PixelY / 256 );
  $PixelXint = floor( $PixelX );
  $px = $PixelXint % 256;
  $PixelYint = floor( $PixelY );
  $py = $PixelYint % 256;
  $sFileName = "http://cyberjapandata.gsi.go.jp/xyz/".$demSource."/".$zoom."/".$TileX."/".$TileY.".txt";

  $sTextAll = null;
  $context = stream_context_create(
      array(
        'http' => array('ignore_errors' => true)
      )
    );
  $sTextAll = file_get_contents( $sFileName, false, $context );

  if( !$sTextAll )
    return $nCONST_NO_DATA;

  preg_match('/HTTP\/1\.[0|1|x] ([0-9]{3})/', $http_response_header[0], $matches);
  $status_code = $matches[1];

  switch ($status_code)
  {
    case '200':
      break;
    case '404':
      return $nCONST_NO_DATA;
    default:
      return $nCONST_NO_DATA;
  }

  $sTextAll = preg_replace("/\r\n|\r|\n/", "\n", $sTextAll);
  $asText = explode( "\n",  $sTextAll );
  if( count( $asText ) < $py )
    return $nCONST_NO_DATA;
  $Lpy = $asText[$py];
  $pxs = explode( ",", $Lpy );
  if( count( $pxs ) < $px )
    return $nCONST_NO_DATA;
  $Spx = $pxs[$px];
  if( $Spx == "e" )
    return $nCONST_NO_DATA;

  $Spx = floatval( $Spx );
  $Spx = round( $Spx, $dataRound );
  if( $Spx <- 500 )
    $Spx = NULL;
    return $Spx;
}


$sCallBack = "";
if( isset( $_GET['callback'] ) )
{
  $sCallBack = $_GET['callback'];
}

$lon = floatval( $_GET['lon'] );
$lat = floatval( $_GET['lat'] );



$lng_rad = deg2rad( $lon );
$lat_rad = deg2rad( $lat );
$R = 128 / M_PI;
$worldCoordX = $R * ( $lng_rad + M_PI );
$worldCoordY = ( -1 ) * $R/2 * log( ( 1+sin( $lat_rad ) )/( 1-sin( $lat_rad ) ) ) + 128;

$elevation = getElevation( $worldCoordX, $worldCoordY, 15,'dem5a', 1 );
$hsrc = "5m（レーザ）";

if( $elevation == $nCONST_NO_DATA )
{
  $elevation = getElevation( $worldCoordX,$worldCoordY,15,'dem5b',1 );
  $hsrc = "5m（写真測量）";
}

if( $elevation == $nCONST_NO_DATA )
{
  $elevation = getElevation( $worldCoordX, $worldCoordY, 14, 'dem',0 );
  $hsrc = "10m";
}

if( $elevation == $nCONST_NO_DATA )
{
  $elevation = "-----";
  $hsrc = "-----";
}

if( $elevation == "-----" )
{
  $sBody = '{"elevation": "'.$elevation.'", "hsrc": "'.$hsrc.'"}';
}
else
{
  $sBody = '{"elevation": '.$elevation.', "hsrc": "'.$hsrc.'"}';
}

if( !isset( $_GET['outtype'] ))
{
  $sBody = $_GET['callback'].'( '.$sBody.' )';
}

header( 'Content-Type: application/json; charset=utf-8' );
echo $sBody;
?>
