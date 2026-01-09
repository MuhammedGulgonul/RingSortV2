# Load System.Drawing for Image resizing
Add-Type -AssemblyName System.Drawing

# Paths - Using the artifact path explicitly known
$sourcePath = "C:\Users\Muhammed\.gemini\antigravity\brain\f5f6cd0d-1982-4a88-a54d-cc4e7021e62b\ring_sort_icon_v2_1767725127411.png"
$destPath192 = "c:\Users\Muhammed\Desktop\Oyun\icon_192.png"

# Check if source exists
if (-not (Test-Path $sourcePath)) {
    Write-Host "Error: Source icon not found at $sourcePath"
    exit
}

# Load Image
$img = [System.Drawing.Image]::FromFile($sourcePath)

# Resize to 192x192
$bmp = new-object System.Drawing.Bitmap(192, 192)
$graph = [System.Drawing.Graphics]::FromImage($bmp)
$graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graph.DrawImage($img, 0, 0, 192, 192)

# Save as PNG
$bmp.Save($destPath192, [System.Drawing.Imaging.ImageFormat]::Png)

# Dispose
$graph.Dispose()
$bmp.Dispose()
$img.Dispose()

Write-Host "Success: Created icon_192.png"
