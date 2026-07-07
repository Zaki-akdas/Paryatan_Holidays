# Downloads real destination-specific images from Unsplash CDN (free, no key needed for direct photo URLs)
# Photos are copyright their respective photographers on Unsplash (free to use under Unsplash license)

$BASE = "c:\Users\zakia\OneDrive\Desktop\Website 1\public\images\destinations"
$UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

# Each entry: [destination] => @(photo-id-1, photo-id-2, photo-id-3, photo-id-4)
# These are real Unsplash photo IDs for each destination
$images = [ordered]@{
  agra = @(
    "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80"   # Taj Mahal
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80"   # Agra Fort
    "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80"   # Taj Mahal sunset
    "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80"   # Taj Mahal garden
  )
  kashmir = @(
    "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=1200&q=80"   # Dal Lake
    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80"   # Kashmir mountains
    "https://images.unsplash.com/photo-1597074866923-dc0589150358?w=1200&q=80"   # Kashmir valley
    "https://images.unsplash.com/photo-1584813470613-b3cfa73d1a75?w=1200&q=80"   # Shikara boats
  )
  kerala = @(
    "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80"   # Kerala backwaters
    "https://images.unsplash.com/photo-1580889108082-ee8cf06c0862?w=1200&q=80"   # Munnar tea
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80"   # Houseboat
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80"   # Fort Kochi beach
  )
  dubai = @(
    "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200&q=80"   # Dubai skyline
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80"   # Burj Khalifa
    "https://images.unsplash.com/photo-1546412414-e1885259563a?w=1200&q=80"   # Dubai marina
    "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1200&q=80"   # Desert dunes
  )
  bali = @(
    "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80"   # Bali rice terraces
    "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1200&q=80"   # Bali temple
    "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200&q=80"   # Bali beach
    "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200&q=80"   # Tanah Lot
  )
  goa = @(
    "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80"   # Goa beach
    "https://images.unsplash.com/photo-1587922546307-776227941871?w=1200&q=80"   # Goa sunset
    "https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=1200&q=80"   # Goa coastline
    "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&q=80"   # Goa church
  )
  ladakh = @(
    "https://images.unsplash.com/photo-1589556264800-08ae9e129a8e?w=1200&q=80"   # Pangong Lake
    "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&q=80"   # Ladakh mountains
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"   # Mountain range
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80"   # Buddhist monastery
  )
  jaipur = @(
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80"   # Amber Fort
    "https://images.unsplash.com/photo-1586002929476-d7a706c9f0b4?w=1200&q=80"   # Hawa Mahal
    "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200&q=80"   # Jaipur palace
    "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=1200&q=80"   # Jaipur streets
  )
  darjeeling = @(
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80"   # Tea plantation
    "https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=1200&q=80"   # Mountain hills
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80"   # Himalayan peaks
    "https://images.unsplash.com/photo-1510797215324-95aa89f43c33?w=1200&q=80"   # Green valley
  )
  kanha = @(
    "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1200&q=80"   # Tiger
    "https://images.unsplash.com/photo-1591824438708-ce405f36ba3d?w=1200&q=80"   # Indian wildlife
    "https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=1200&q=80"   # Forest
    "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=1200&q=80"   # Wild deer
  )
  mysore = @(
    "https://images.unsplash.com/photo-1582972236019-ea4af5ffe587?w=1200&q=80"   # Mysore Palace
    "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=1200&q=80"   # Palace at night
    "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=1200&q=80"   # South India temple
    "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?w=1200&q=80"   # Indian garden
  )
  rishikesh = @(
    "https://images.unsplash.com/photo-1610025836163-09f8d42e7a64?w=1200&q=80"   # Rishikesh Ganga
    "https://images.unsplash.com/photo-1602615576820-ea14fd9d6848?w=1200&q=80"   # River rafting
    "https://images.unsplash.com/photo-1623592765536-4e9f52e48b68?w=1200&q=80"   # Yoga
    "https://images.unsplash.com/photo-1521336575822-6da63fb45455?w=1200&q=80"   # Suspension bridge
  )
}

$ok = 0; $fail = 0

foreach ($dest in $images.Keys) {
  $folder = Join-Path $BASE $dest
  New-Item -ItemType Directory -Force -Path $folder | Out-Null
  Write-Host "`n📍 $($dest.ToUpper())"

  $urls = $images[$dest]
  for ($i = 0; $i -lt $urls.Count; $i++) {
    $url = $urls[$i]
    $out = Join-Path $folder "$($i+1).jpg"
    Write-Host -NoNewline "  [$($i+1)/$($urls.Count)] "

    curl -s -L -o $out -A $UA $url 2>&1 | Out-Null
    
    if ((Test-Path $out) -and (Get-Item $out).Length -gt 5000) {
      $kb = [math]::Round((Get-Item $out).Length / 1024)
      Write-Host "✓ ${kb} KB"
      $ok++
    } else {
      Write-Host "✗ Failed"
      if (Test-Path $out) { Remove-Item $out }
      $fail++
    }
    Start-Sleep -Milliseconds 300
  }
}

Write-Host "`n`n✅ Done! $ok downloaded, $fail failed"
