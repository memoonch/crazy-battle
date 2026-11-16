$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$projectRoot = Split-Path -Parent $PSScriptRoot
$artRoot = Join-Path $projectRoot 'remaster/assets/art'
$outputRoot = Join-Path $projectRoot 'remaster/assets/preloader'
New-Item -ItemType Directory -Path $outputRoot -Force | Out-Null
$manifest = Get-Content -LiteralPath (Join-Path $artRoot 'manifest.json') -Raw | ConvertFrom-Json

# Small background; the loading UI supplies its dark treatment in CSS.
$source = [System.Drawing.Image]::FromFile((Join-Path $artRoot 'forest-battlefield.png'))
$background = [System.Drawing.Bitmap]::new(640,360)
$graphics = [System.Drawing.Graphics]::FromImage($background)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.DrawImage($source,[System.Drawing.Rectangle]::new(0,0,640,360))
$jpeg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$parameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
$parameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality,[long]72)
$background.Save((Join-Path $outputRoot 'forest-loading.jpg'),$jpeg,$parameters)
$parameters.Dispose(); $graphics.Dispose(); $background.Dispose(); $source.Dispose()

# Four existing run poses, equal cells and aligned feet; face toward progress.
$source = [System.Drawing.Image]::FromFile((Join-Path $artRoot 'rifle-soldier-atlas.png'))
$strip = [System.Drawing.Bitmap]::new(256,64)
$graphics = [System.Drawing.Graphics]::FromImage($strip)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
for($frameIndex=0;$frameIndex -lt 4;$frameIndex++) {
  $frame = $manifest.'rifle-soldier-atlas'.frames[$frameIndex]
  $poseWidth = 54.0 * $frame.width / $frame.height
  $state = $graphics.Save()
  $graphics.TranslateTransform($frameIndex*64+64,0)
  $graphics.ScaleTransform(-1,1)
  $destination = [System.Drawing.RectangleF]::new((64-$poseWidth)/2,8,$poseWidth,54)
  $sourceBounds = [System.Drawing.RectangleF]::new($frame.x,$frame.y,$frame.width,$frame.height)
  $graphics.DrawImage($source,$destination,$sourceBounds,[System.Drawing.GraphicsUnit]::Pixel)
  $graphics.Restore($state)
}
$strip.Save((Join-Path $outputRoot 'soldier-run.png'),[System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose(); $strip.Dispose(); $source.Dispose()
Get-ChildItem -LiteralPath $outputRoot | Select-Object Name,Length
