
path = r"d:\SPION\SPION_KI-main\kuisoner-form-script.js"
try:
    with open(path, 'rb') as f:
        lines = f.readlines()
    
    for i, line in enumerate(lines):
        try:
            decoded = line.decode('utf-8')
            if any(ord(c) > 127 for c in decoded):
                print(f"Line {i+1}: {repr(decoded.strip())}")
        except UnicodeDecodeError:
             print(f"Line {i+1} (Decode Error): {line}")

except Exception as e:
    print(f"Error: {e}")
