interface SerilogConfig {
    Using: string[];
    MinimumLevel: {
      Default: string;
      Override: {
        [key: string]: string;
      };
    };
    WriteTo: WriteToSink[];
    Enrich: string[];
  }
  
  interface WriteToSink {
    Name: string;
    Args?: {
      [key: string]: any;
    };
  }
  
  interface AppConfig {
    Serilog: SerilogConfig;
  }
  