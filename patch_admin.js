    // Fetch external inventory
    try {
      const invRes = await fetch('/api/inventory');
      const invData = await invRes.json();
      if (invData.success && invData.inventory) {
        invData.inventory.forEach(item => {
          if(MODELS[item.modelId]) {
            MODELS[item.modelId].stock = item.stock;
          }
        });
      }
    } catch(e) { console.warn('Inventory fetch failed');}
