<template>
  <div
    ref="receiptRef"
    class="receipt-print bg-white text-black p-6 font-mono text-sm max-w-[80mm] mx-auto"
    :class="{ 'hidden': !show }">
    <div class="text-center mb-4 border-b border-dashed border-gray-400 pb-3">
      <h2 class="text-lg font-bold">DIASO</h2>
      <p class="text-xs text-gray-600">Point of Sale Receipt</p>
    </div>

    <div class="text-xs mb-3">
      <p>Receipt #: {{ sale?.orderNumber || '-' }}</p>
      <p>Date: {{ formatDate(new Date()) }}</p>
      <p>Cashier: {{ cashierName }}</p>
    </div>

    <div class="border-t border-b border-gray-400 py-2 my-2">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="flex justify-between py-1">
        <span>{{ item.product?.itemName }} x{{ item.quantity }}</span>
        <span>{{ formatCurrency(item.quantity * item.unitPrice) }}</span>
      </div>
    </div>

    <div class="text-right font-bold text-base mt-3">
      TOTAL: {{ formatCurrency(total) }}
    </div>

    <div class="text-xs mt-4 text-center text-gray-600 border-t border-dashed border-gray-400 pt-3">
      <p>Payment: {{ paymentMethod }}</p>
      <p class="mt-2">Thank you for your purchase!</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  sale: { type: Object, default: null },
  items: { type: Array, default: () => [] },
  total: { type: Number, default: 0 },
  paymentMethod: { type: String, default: 'CASH' },
  cashierName: { type: String, default: '' },
  show: { type: Boolean, default: false },
});

const receiptRef = ref(null);

const formatCurrency = (n) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n || 0);
};

const formatDate = (d) => {
  return new Date(d).toLocaleString();
};

defineExpose({
  print: () => {
    if (!props.show) return;
    const el = receiptRef.value;
    if (!el) return;
    // Use clone to strip sr-only/hidden from the printed copy
    const clone = el.cloneNode(true);
    clone.classList.remove('sr-only', 'hidden');
    const printContent = clone.outerHTML;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print the receipt.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: monospace; padding: 16px; font-size: 12px; max-width: 80mm; margin: 0 auto; background: #fff; color: #000; }
            .receipt-print { background: #fff; color: #000; padding: 24px; font-size: 12px; max-width: 80mm; margin: 0 auto; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  },
});
</script>
