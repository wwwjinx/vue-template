<script setup lang="ts">
import type { OperLogInfo } from '@/types/system'
import { ElMessage, ElMessageBox } from 'element-plus'
import { cleanOperlog, delOperlog, listOperlog } from '@/api/monitor/operlog'

const { sys_oper_type, sys_common_status } = useDict('sys_oper_type', 'sys_common_status')

const loading = ref(false)
const total = ref(0)
const rows = ref<OperLogInfo[]>([])
const selectedIds = ref<number[]>([])
const detail = ref<OperLogInfo>()
const detailVisible = ref(false)
const query = reactive({
  pageNum: 1,
  pageSize: 10,
  title: '',
  operName: '',
  businessType: undefined as number | undefined,
  status: undefined as number | undefined,
})

async function loadList() {
  loading.value = true
  try {
    const res = await listOperlog({ ...query })
    rows.value = res?.rows ?? []
    total.value = res?.total ?? 0
  }
  finally {
    loading.value = false
  }
}

async function onDelete(row?: OperLogInfo) {
  const ids = row ? String(row.operId) : selectedIds.value.join(',')
  if (!ids)
    return
  await ElMessageBox.confirm('确认删除选中的操作日志吗？', '提示', { type: 'warning' })
  await delOperlog(ids)
  ElMessage.success('删除成功')
  loadList()
}

async function onClean() {
  await ElMessageBox.confirm('确认清空全部操作日志吗？', '提示', { type: 'warning' })
  await cleanOperlog()
  ElMessage.success('清空成功')
  loadList()
}

function openDetail(row: OperLogInfo) {
  detail.value = row
  detailVisible.value = true
}

onMounted(loadList)
</script>

<template>
  <div>
    <ElForm :inline="true" :model="query">
      <ElFormItem label="系统模块">
        <ElInput v-model="query.title" clearable />
      </ElFormItem>
      <ElFormItem label="操作人员">
        <ElInput v-model="query.operName" clearable />
      </ElFormItem>
      <ElFormItem label="类型">
        <ElSelect v-model="query.businessType" clearable style="width: 140px">
          <ElOption v-for="item in sys_oper_type.list" :key="item.value" :label="item.label" :value="Number(item.value)" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="状态">
        <ElSelect v-model="query.status" clearable style="width: 140px">
          <ElOption v-for="item in sys_common_status.list" :key="item.value" :label="item.label" :value="Number(item.value)" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" @click="query.pageNum = 1; loadList()">
          搜索
        </ElButton>
        <ElButton v-hasPermi="'monitor:operlog:remove'" type="danger" :disabled="!selectedIds.length" @click="onDelete()">
          删除
        </ElButton>
        <ElButton v-hasPermi="'monitor:operlog:remove'" type="danger" @click="onClean">
          清空
        </ElButton>
      </ElFormItem>
    </ElForm>
    <ElTable v-loading="loading" :data="rows" @selection-change="(list: OperLogInfo[]) => selectedIds = list.map(i => i.operId)">
      <ElTableColumn type="selection" width="50" />
      <ElTableColumn prop="operId" label="编号" width="70" />
      <ElTableColumn prop="title" label="系统模块" />
      <ElTableColumn label="类型" width="90">
        <template #default="{ row }">
          {{ sys_oper_type.valueToLabel[String(row.businessType ?? '')] ?? row.businessType }}
        </template>
      </ElTableColumn>
      <ElTableColumn prop="operName" label="操作人员" />
      <ElTableColumn prop="operIp" label="操作 IP" />
      <ElTableColumn label="状态" width="80">
        <template #default="{ row }">
          {{ sys_common_status.valueToLabel[String(row.status ?? '')] ?? row.status }}
        </template>
      </ElTableColumn>
      <ElTableColumn prop="operTime" label="操作时间" min-width="160" />
      <ElTableColumn prop="costTime" label="耗时(ms)" width="100" />
      <ElTableColumn label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <ElButton v-hasPermi="'monitor:operlog:query'" link type="primary" @click="openDetail(row)">
            详细
          </ElButton>
          <ElButton v-hasPermi="'monitor:operlog:remove'" link type="danger" @click="onDelete(row)">
            删除
          </ElButton>
        </template>
      </ElTableColumn>
    </ElTable>
    <div class="pager">
      <ElPagination
        v-model:current-page="query.pageNum"
        v-model:page-size="query.pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next"
        @current-change="loadList" @size-change="loadList"
      />
    </div>
    <ElDialog v-model="detailVisible" title="操作日志详情" width="640px">
      <ElDescriptions v-if="detail" :column="1" border>
        <ElDescriptionsItem label="模块">
          {{ detail.title }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="请求方法">
          {{ detail.method }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="请求方式">
          {{ detail.requestMethod }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="请求地址">
          {{ detail.operUrl }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="请求参数">
          {{ detail.operParam }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="返回结果">
          {{ detail.jsonResult }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="错误信息">
          {{ detail.errorMsg }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </ElDialog>
  </div>
</template>

<style scoped>
.pager {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
</style>
