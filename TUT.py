import RPi.GPIO as GPIO
import time
import requests
from datetime import date

# Configuração dos pinos GPIO
PIN_LED = 19
PIN_BUZZER = 23
PIN_BUTTON = 18

# Configuração do Thingspeak
THINGSPEAK_API_KEY = "8MDKYJE2XRTYPTE6"
THINGSPEAK_URL = f"https://api.thingspeak.com/update?api_key={THINGSPEAK_API_KEY}"

# Configuração dos tempos de trabalho e descanso
TEMPO_TRABALHO = 25 * 60  # 25 minutos em segundos
TEMPO_INTERVALO_CURTO = 5 * 60  # 5 minutos em segundos
TEMPO_INTERVALO_LONGO = 15 * 60  # 15 minutos em segundos
CICLOS = 3  # Número de ciclos antes do intervalo longo

# Variáveis de controle
esta_rodando = False
tempo_total_rodando = 0
ciclo_atual = 0
horas_diarias = {}  # Dicionário para armazenar as horas utilizadas diariamente

# Inicialização dos pinos GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(PIN_LED, GPIO.OUT)
GPIO.setup(PIN_BUZZER, GPIO.OUT)
GPIO.setup(PIN_BUTTON, GPIO.IN, pull_up_down=GPIO.PUD_UP)

def iniciar_timer():
    global esta_rodando, tempo_total_rodando, ciclo_atual
    esta_rodando = True
    tempo_total_rodando = 0
    ciclo_atual = 0
    GPIO.output(PIN_LED, GPIO.HIGH)
    GPIO.output(PIN_BUZZER, GPIO.HIGH)
    time.sleep(0.75)
    GPIO.output(PIN_LED, GPIO.LOW)
    GPIO.output(PIN_BUZZER, GPIO.LOW)
    print("Aparelho ligado.")
    
    while esta_rodando:
        if ciclo_atual < CICLOS:
            nome_ciclo = "Trabalho"
            tempo_ciclo = TEMPO_TRABALHO
        else:
            nome_ciclo = "Intervalo Longo"
            tempo_ciclo = TEMPO_INTERVALO_LONGO
            
        print(f"Ciclo: {ciclo_atual + 1} ({nome_ciclo})")
        
        GPIO.output(PIN_LED, GPIO.HIGH)
        GPIO.output(PIN_BUZZER, GPIO.HIGH)
        time.sleep(0.75)
        GPIO.output(PIN_LED, GPIO.LOW)
        GPIO.output(PIN_BUZZER, GPIO.LOW)
        
        time.sleep(tempo_ciclo)
        tempo_total_rodando += tempo_ciclo
        
        if ciclo_atual < CICLOS:
            print("Intervalo Curto")
            GPIO.output(PIN_BUZZER, GPIO.HIGH)
            time.sleep(0.75)
            GPIO.output(PIN_BUZZER, GPIO.LOW)
            time.sleep(TEMPO_INTERVALO_CURTO)
        else:
            print("Intervalo Longo")
            GPIO.output(PIN_BUZZER, GPIO.HIGH)
            time.sleep(0.75)
            GPIO.output(PIN_BUZZER, GPIO.LOW)
            time.sleep(TEMPO_INTERVALO_LONGO)
            
        ciclo_atual += 1
        ciclo_atual %= CICLOS + 1

def parar_timer():
    global esta_rodando
    esta_rodando = False
    GPIO.output(PIN_LED, GPIO.LOW)
    GPIO.output(PIN_BUZZER, GPIO.LOW)
    print("Aparelho desligado.")

def enviar_dados_para_thingspeak():
    try:
        valores = list(horas_diarias.values())
        valores_str = ','.join(str(valor) for valor in valores)
        params = {"field1": valores_str}
        response = requests.get(THINGSPEAK_URL, params=params)
        
        if response.status_code == 200:
            print("Dados enviados para o Thingspeak.")
        else:
            print("Falha ao enviar dados para o Thingspeak. Código de status:", response.status_code)
    except requests.exceptions.RequestException as e:
        print("Falha ao enviar dados para o Thingspeak:", e)

def callback_botao(channel):
    global esta_rodando
    if GPIO.input(PIN_BUTTON) == GPIO.LOW:
        if esta_rodando:
            parar_timer()
            print("Timer parado.")
        else:
            iniciar_timer()
            print("Timer iniciado.")

GPIO.add_event_detect(PIN_BUTTON, GPIO.FALLING, callback=callback_botao, bouncetime=200)

try:
    while True:
        if esta_rodando:
            enviar_dados_para_thingspeak()
        time.sleep(1)
except KeyboardInterrupt:
    pass
finally:
    GPIO.cleanup()
