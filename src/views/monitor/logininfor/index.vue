<script setup lang="ts">
import type { LoginLogInfo } from '@/types/system'
import { ElMessage, ElMessageBox } from 'element-plus'
import { cleanLogininfor, delLogininfor, listLogininfor } from '@/api/monitor/logininfor'

const { sys_common_status } = useDict('sys_common_status')

const loading = ref(false)
const total = ref(0)
const rows = ref<LoginLogInfo[]>([])
const selectedIds = ref<number[]>([])
const query = reactive({
  pageNum: 1,
  pageSize: 10,
  userName: '',
  ipaddr: '',
  status: '',
})

async function loadList() {
  loading.value = true
  try {
    const res = await listLogininfor({ ...query })
    rows.value = res?.rows ?? []
    total.value = res?.total ?? 0
  }
  finally {
    loading.value = false
  }
}

async function onDelete(row?: LoginLogInfo) {
  const ids = row ? String(row.infoId) : selectedIds.value.join(',')
  if (!ids)
    return
  await ElMessageBox.confirm('确认删除选中的登录日志吗？', '提示', { type: 'warning' })
  await delLogininfor(ids)
  ElMessage.success('删除成功')
  loadList()
}

async function onClean() {
  await ElMessageBox.confirm('确认清空全部登录日志吗？', '提示', { type: 'warning' })
  await cleanLogininfor()
  ElMessage.success('清空成功')
  loadList()
}

onMounted(loadList)
</script>

<template>
  <div>
    <ElForm :inline="true" :model="query">
      <ElFormItem label="用户名">
        <ElInput v-model="query.userName" clearable />
      </ElFormItem>
      <ElFormItem label="登录地址">
        <ElInput v-model="query.ipaddr" clearable />
      </ElFormItem>
      <ElFormItem label="状态">
        <ElSelect v-model="query.status" clearable style="width: 140px">
          <ElOption v-for="item in sys_common_status.list" :key="item.value" :label="item.label" :value="item.value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" @click="query.pageNum = 1; loadList()">
          搜索
        </ElButton>
        <ElButton v-hasPermi="'monitor:logininfor:remove'" type="danger" :disabled="!selectedIds.length" @click="onDelete()">
          删除
        </ElButton>
        <ElButton v-hasPermi="'monitor:logininfor:remove'" type="danger" @click="onClean">
          清空
        </ElButton>
      </ElFormItem>
    </ElForm>
    <ElTable v-loading="loading" :data="rows" @selection-change="(list: LoginLogInfo[]) => selectedIds = list.map(i => i.infoId)">
      <ElTableColumn type="selection" width="50" />
      <ElTableColumn prop="infoId" label="编号" width="80" />
      <ElTableColumn prop="userName" label="用户名" />
      <ElTableColumn prop="ipaddr" label="登录地址" />
      <ElTableColumn prop="loginLocation" label="登录地点" />
      <ElTableColumn prop="browser" label="浏览器" />
      <ElTableColumn prop="os" label="操作系统" />
      <ElTableColumn label="状态" width="80">
        <template #default="{ row }">
          {{ sys_common_status.valueToLabel[row.status || ''] || row.status }}
        </template>
      </ElTableColumn>
      <ElTableColumn prop="msg" label="提示" />
      <ElTableColumn prop="loginTime" label="登录时间" min-width="160" />
      <ElTableColumn label="操作" width="80" fixed="right">
        <template #default="{ row }">
          <ElButton v-hasPermi="'monitor:logininfor:remove'" link type="danger" @click="onDelete(row)">
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
  </div>
</template>

<style scoped>
.pager {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
</style>
