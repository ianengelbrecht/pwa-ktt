<form id="species-form">

  <label>
    Common Name (Birdlife SA 2024):
    <input type="text" name="commonName1" />
  </label><br />

  <label>
    Afrikaans Name (Birdlife SA 2024):
    <input type="text" name="commonName2" />
  </label><br />

  <label>
    Taxonomic Name (Birdlasser):
    <input type="text" name="taxonName1" />
  </label><br />

  <label>
    Taxonomic Name (Birdlife SA 2024):
    <input type="text" name="taxonName2" />
  </label><br />

  <label>
    WEF Priority:
    <input type="text" name="priorty" />
  </label><br />

  <label>
    SCC:
    <input type="text" name="scc" />
  </label><br />

  <label>
    WEF Priority Species Rank:
    <input type="text" name="priorityRank" />
  </label><br />

  <label>
    Global Status (IUCN, 2024):
    <input type="text" name="globalStatus" />
  </label><br />

  <label>
    Regional Status (Taylor et al. 2015):
    <input type="text" name="regionalStatus" />
  </label><br />

  <label>
    Notes:
    <textarea name="speciesNotes"></textarea>
  </label><br />

  <label>
    Small Bird (&lt;30cm):
    <input type="number" name="smallBird" min="0" max="1" />
  </label><br />

  <label>
    Large Bird (&gt;30cm):
    <input type="number" name="largeBird" min="0" max="1" />
  </label><br />

  <label>
    Raptor:
    <input type="number" name="raptor" min="0" max="1" />
  </label><br />

  <label>
    Waterbird (Associated):
    <input type="number" name="waterbird" min="0" max="1" />
  </label><br />
  
  <button type="submit">Submit</button>
</form>
