import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable()
export class AppSetting {
  public static BASE_URL = environment.basePath;
  public static IS_IDLE_TIME = environment.idleTimeEnable;
  public static IDLE_TIME = 30;
  public static HEADER_ACCEPT_LANGUAGE = 'en-US';
  public static HEADER_CONTENT_TYPE = 'application/json;charset=utf-8';
  public static HEADER_FILE_CONTENT_TYPE = 'multipart/form-data';
  public static MODERATELY_LOW = "Moderately Low";
  public static LOW = "Low";
  public static RISK_aVERSE = "Risk averse";
  public static RISK_AVERSE = "Risk Averse";
  public static MODERATE = "Moderate";
  public static MODERATELY_HIGH = "Moderately High";
  public static HIGH = "High";
  public static HIGHLY_AGGRESSIVE = "Highly Aggressive";
  public static CONSERVATIVE = "Conservative";
  public static LOW_MODERATE = "Low Moderate";
  public static AGGRESSIVE = "Aggressive";
  public static HIGH_MODERATE = "High Moderate";
  public static VERY_HIGH = "Very High";
}

