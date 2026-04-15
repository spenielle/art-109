$root = "c:\Users\denie\OneDrive\Documents\GitHub\art-109\tutorials\github-copilot\copilot-demo-turn-in\kpop-haikyuu-cyberpunk"
Set-Location $root
$htmlPath = Join-Path $root "index.html"
$imagesDir = Join-Path $root "images"
New-Item -ItemType Directory -Force -Path $imagesDir | Out-Null
$html = Get-Content -Raw -Path $htmlPath
$regex = New-Object System.Text.RegularExpressions.Regex('<article(?<articleHeader>[^>]*?data-name="(?<name>[^"]+)"[^>]*?>)(?<inner>.*?<div class="card__avatar"[^>]*></div>)(?<rest>.*?</article>)',[System.Text.RegularExpressions.RegexOptions]::Singleline)
$matches = $regex.Matches($html)
if ($matches.Count -eq 0) {
    Write-Error "No matches found"
    exit 1
}
$gradients = @( 
    @("#6f4ef5","#00e5ff"), @("#ff68d2","#7c68ff"), @("#ffd16f","#00d3d6"), @("#ff8d49","#ff5bba"), @("#ff4646","#faff00"),
    @("#224cff","#2dd2ff"), @("#8834ff","#36fff8"), @("#15ffe1","#ff62d8"), @("#ffbea8","#b28cff"), @("#00cef7","#7b61ff"),
    @("#ff8fdc","#ffba55"), @("#5b8cff","#4bf8ff"), @("#ff6f76","#ffcf69"), @("#ff6633","#ffbb73"), @("#005bff","#4dc5ff"),
    @("#a8fffb","#6d7bff"), @("#ffd558","#ff7abf"), @("#ff5a53","#ff9f7d"), @("#8cff79","#50ffe1"), @("#d75bff","#ff6fb6"),
    @("#ffce4d","#ff5a47"), @("#6eff8e","#00d9ff"), @("#ff7aff","#6c82ff"), @("#ffb44b","#ff4d5f"), @("#4d3bff","#ff6aff"),
    @("#b7fffc","#8c7cff"), @("#ff8a8a","#ffcd3f"), @("#f9ff6f","#ff6f6f"), @("#85f6ff","#8d75ff")
)
$replacements = @()
foreach ($m in $matches) {
    $name = $m.Groups['name'].Value
    $slug = ($name.ToLower() -replace '[^a-z0-9]+','-').Trim('-')
    $fileName = "$slug.svg"
    $imgTag = "<div class=`"card__avatar`"><img src=`"images/$fileName`" alt=`"Portrait of $name`" /></div>"
    $replacement = "$($m.Groups['articleHeader'].Value)$($m.Groups['inner'].Value)$imgTag$($m.Groups['rest'].Value)"
    $replacements += ,@($m.Value, $replacement, $name, $slug, $fileName)
}
foreach ($pair in $replacements) {
    $html = $html.Replace($pair[0], $pair[1])
}
Set-Content -Path $htmlPath -Value $html -Encoding utf8
foreach ($pair in $replacements) {
    $path = Join-Path $imagesDir $pair[4]
    if (-not (Test-Path $path)) {
        $index = [math]::Abs($pair[3].GetHashCode()) % $gradients.Count
        $c = $gradients[$index]
        $color1 = $c[0]
        $color2 = $c[1]
        $svg = @"
<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"400\" height=\"400\" viewBox=\"0 0 400 400\">
  <defs>
    <linearGradient id=\"g\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">
      <stop offset=\"0%\" stop-color=\"$color1\" />
      <stop offset=\"100%\" stop-color=\"$color2\" />
    </linearGradient>
  </defs>
  <rect width=\"400\" height=\"400\" rx=\"40\" ry=\"40\" fill=\"url(#g)\" />
  <text x=\"50%\" y=\"45%\" text-anchor=\"middle\" fill=\"#ffffff\" font-family=\"Inter, sans-serif\" font-size=\"36\" font-weight=\"700\">$name</text>
  <text x=\"50%\" y=\"62%\" text-anchor=\"middle\" fill=\"rgba(255,255,255,0.8)\" font-family=\"Inter, sans-serif\" font-size=\"20\">Cyberpunk Fan Art</text>
</svg>
"@
        Set-Content -Path $path -Value $svg -Encoding utf8
    }
}
Write-Host "Updated $($replacements.Count) cards and created $($replacements.Count) avatar images."
