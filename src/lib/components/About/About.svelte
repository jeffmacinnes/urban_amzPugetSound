<script>
	import Heading from '$components/common/Heading.svelte';
	import TextBlocks from '$components/common/TextBlocks.svelte';
	import Button from '$components/common/Button.svelte';
	import IconDownload from '$assets/icon_download.svg';

	export let content = [];
</script>

<Heading text="About" />
<TextBlocks blocks={content} />
<div class="body-content">
	<Button>Download Data <img src={IconDownload} alt="" style:width={'16px'} /></Button>
</div>
