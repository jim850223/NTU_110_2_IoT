### Update
將本地端(controller)檔案上傳到remote端(node)，並檢查資料夾，不存在的話就建立資料夾
### Test command
請自行修改IP相關參數
```
ansible-playbook  Update.yaml -i inventory.ini
```
### Work flow
1. 檢查資料夾 
ref: https://docs.ansible.com/ansible/latest/collections/ansible/builtin/stat_module.html

2. 建立資料夾
ref: https://docs.ansible.com/ansible/latest/collections/ansible/builtin/file_module.html

3. 複製本地端檔案到遠端
ref: https://docs.ansible.com/ansible/latest/collections/ansible/builtin/copy_module.html

4. 顯示DEBUG訊息
ref:  https://docs.ansible.com/ansible/latest/collections/ansible/builtin/debug_module.html
