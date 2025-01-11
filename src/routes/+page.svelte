<script>
// @ts-nocheck

  import { onMount } from 'svelte';
  import { open } from "@tauri-apps/plugin-dialog";
  import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
  import { Avatar, FileButton } from '@skeletonlabs/skeleton';

  let fileContent = "";
  let filePath = "";
  
  let config = {
    Serilog: {
      Using: [],
      MinimumLevel: {
        Default: '',
        Override: {}
      },
      WriteTo: [],
      Enrich: []
    },
  };

  async function handleOpenFile() {
    try {
      // Открываем диалог выбора файла
      const selectedPath = await open({
        multiple: false,
        // Можно указать фильтры по типам файлов:
        filters: [
          {
            name: "Text files",
            extensions: ["txt", "csv", "json"]
          },
          {
            name: "All files",
            extensions: ["*"]
          }
        ]
      });

      // Если пользователь не отменил диалог
      if (selectedPath) {
        // Считываем текст из выбранного файла
        fileContent = await readTextFile(String(selectedPath));
        config = JSON.parse(fileContent);
        filePath = selectedPath;
      }
    } catch (error) {
      console.error("File read error:", error);
    }
  }

  async function saveConfig() {
    try {
      const jsonContent = JSON.stringify(config, null, 2);
      await writeTextFile(filePath, jsonContent);
      alert('Конфигурация успешно сохранена!');
    } catch (error) {
      console.error('Ошибка при сохранении конфигурации:', error);
    }
  }

  onMount(() => {
    handleOpenFile();
  });
</script>

<main>
  <button type="button" on:click={handleOpenFile}>Open file</button>

  <h1>Serilog</h1>

  <div class="section">
    <h2>Using</h2>
    {#each config.Serilog.Using, index}
      <div class="list-item">
        <input class="input"
          placeholder="Input"
          type="text"
          bind:value={config.Serilog.Using[index]}
        />
      </div>
    {/each}
  </div>

  <div class="section">
    <h2>MinimumLevel</h2>
    <div>
      <label>
        Default:
        <input class="input"
          type="text"
          bind:value={config.Serilog.MinimumLevel.Default}
        />
      </label>
    </div>
    <div>
      <h3>Override</h3>
      {#each Object.keys(config.Serilog.MinimumLevel.Override) as key}
        <div class="list-item">
          <span>{key}:</span>
            <input class="input"
              type="text"
              bind:value={config.Serilog.MinimumLevel.Override[key]}
            >
        </div>
      {/each}
    </div>
  </div>
  
  <FileButton on:click={saveConfig}>Сохранить Изменения</FileButton>

  <h1>Содержимое файла</h1>
  <pre>{fileContent}</pre>
  
</main>