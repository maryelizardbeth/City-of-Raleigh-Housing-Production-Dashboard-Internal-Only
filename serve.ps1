param(
    [int]$Port = 8787,
    [string]$Root = $PSScriptRoot
)

$ErrorActionPreference = "Stop"

$mime = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".js"   = "text/javascript; charset=utf-8"
    ".mjs"  = "text/javascript; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2" = "font/woff2"
    ".map"  = "application/json; charset=utf-8"
}

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Serving $Root at $prefix (Ctrl+C to stop)"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
      try {

        $relPath = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath).TrimStart("/")
        if ([string]::IsNullOrWhiteSpace($relPath)) { $relPath = "index.html" }

        $fullPath = Join-Path $Root $relPath
        if (Test-Path $fullPath -PathType Container) {
            $fullPath = Join-Path $fullPath "index.html"
        }

        Write-Host ("{0} {1} -> {2}" -f $request.HttpMethod, $request.Url.AbsolutePath, $fullPath)

        if (Test-Path $fullPath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($fullPath)
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
            $ctype = $mime[$ext]
            if (-not $ctype) { $ctype = "application/octet-stream" }
            $response.ContentType = $ctype
            $response.StatusCode = 200
            $response.ContentLength64 = $bytes.Length
            if ($request.HttpMethod -ne "HEAD") {
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
        } else {
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $relPath")
            $response.StatusCode = 404
            $response.ContentLength64 = $msg.Length
            if ($request.HttpMethod -ne "HEAD") {
                $response.OutputStream.Write($msg, 0, $msg.Length)
            }
        }
      } catch {
            Write-Host ("ERROR: {0}" -f $_.Exception.Message)
        } finally {
            try { $response.OutputStream.Close() } catch {}
        }
    }
} finally {
    $listener.Stop()
}
